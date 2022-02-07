import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { HiLoChoices } from "../events-models/HiLoChoices";
import HiLoGameData from "../events-models/HiLoGameData";
import { HiLoRoundCounter } from "../events-models/HiLoRoundCounter";
import { updateRoundId } from "../actions/HiLoRoundCounterAction";
import { HiLoResultModel } from "../events-models/HiLoResultModel";
import { updateStakes, updateTurnOrder, updateCard, handleResultSettle } from "../actions/HiLoDealAction";
import HiLoStakes from "./HiLoStakes";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { updateClockTime, resetCountdowmTimer, updateCountdownTimer } from "../actions/HiLoCountdownTimerAction";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { GameIds } from "../../../configs/SabaConfigs";
import HiLoConfigs from "../events-models/HiLoConfigs";
import { HiLoTurnModel } from "../events-models/HiLoTurnModel";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import { handleGameState } from "../actions/HiLoBetAction";
import HiLoBettingArea, { BettingAreaEvents } from "./HiLoBettingArea";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLoResult from "./HiLoResult";
import GameUtils from "../../../common/GameUtils";
import _ = require("lodash");
import HiLoBetBoard from "./HiLoBetBoard";
import HiLoGameConfigs from "../events-models/HiLoGameConfigs";
import { updateGameConfigs } from "../actions/HiLoGameConfigsAction";
import { numberPad } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

export const HiLoEvents = {
    bet: "bet",
    collect: "collect",
    deal: "deal"
};
@ccclass
export default class HiLo extends NewMiniGameBase {
    @property(HiLoBettingArea)
    bettingAreas: HiLoBettingArea[] = [];

    @property(cc.Node)
    betBoardContainer: cc.Node = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    guideNode: cc.Node = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Node)
    resultAnimation: cc.Node = null;

    @property(cc.Node)
    cardContainer: cc.Node = null;

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    collectButton: cc.Button = null;

    @property(HiLoStakes)
    stakesComp: HiLoStakes = null;

    @property(cc.Node)
    userLose: cc.Node = null;

    @property(HiLoResult)
    resultComp: HiLoResult = null;

    gameData: HiLoGameData<HiLoChoices> = null;
    isStopSchedule = false;
    userLoseMessageDuration = 1.5;
    randomCardDuration = 1.5;
    settleAnimation = 1;
    turnOrder = 0;
    betBoardComp: HiLoBetBoard;

    initMiniPanel(miniPanel: MiniPanel) {
        super.initMiniPanel(miniPanel);
        this.gameId = GameIds.HiLo;
        this.setConfig(new HiLoConfigs());
    }

    onLoad() {
        this.gameData = new HiLoGameData<HiLoChoices>(this);
        super.onLoad();
        this.showHideTopArea();
        this.registerResultEvents();
        this.registerStatusEvents();
        this.registerRoundCounterEvents();
        this.registerBettingAreaEvents();
        this.registerDurationsEvents();
        this.registerTurnEvents();
        this.registerStateEvents();
        this.registerGameConfigsEvents();
        this.initBetBoard();
        this.addCountdownTimerSchedule();
        this.topNode.active = true;
    }

    onEnable() {
        super.onEnable();
        this.isStopSchedule = false;
    }

    onData(data: unknown) {
        super.onData(data);

        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }

    onDisable() {
        super.onDisable();

        this.gameData.isProcessingBet = false;

        if (this.gameData) {
            this.gameData.durations.reset();
        }
    }

    private addCountdownTimerSchedule() {
        this.schedule(() => {
            !this.isStopSchedule && this.gameData.durations.countdown();
        }, 1);
    }

    private registerBettingAreaEvents() {
        this.bettingAreas.forEach((area) => {
            area.node.on(BettingAreaEvents.PLACING_BET, this.onPlacingBet, this);
        });
    }

    private registerResultEvents() {
        this.gameData.resultModel.on(HiLoResultModel.Events.CHANGE, (resultModel) => {
            this.gameData.roundCounter.change(this.gameData.resultModel.roundId);
            updateStakes(this.stakesComp)(resultModel);
            updateCard(this.resultComp)(resultModel);
            updateCountdownTimer(this)(resultModel);
        });
    }

    private registerStatusEvents() {
        this.gameData.statusModel.on(HiLoStatusModel.Events.CHANGE, (statusModel) => {
            handleResultSettle(this)(statusModel);
        });
    }

    private registerRoundCounterEvents() {
        this.gameData.roundCounter.on(HiLoRoundCounter.Events.CHANGE, updateRoundId(this.gameRound));
    }

    private registerTurnEvents() {
        this.gameData.turnModel.on(HiLoTurnModel.Events.CHANGE, updateTurnOrder(this));
    }

    private registerDurationsEvents() {
        this.gameData.durations.on(Durations.Events.PLACING_BET, updateClockTime(this.animatedTime));
        this.gameData.durations.on(Durations.Events.TIMEOUT, () => {
            this.resetCountdownTimer();
        });
    }

    private registerStateEvents() {
        this.gameData.stateModel.on(HiLoStateModel.Events.CHANGE, handleGameState(this));
    }

    private registerGameConfigsEvents() {
        this.gameData.configs.on(HiLoGameConfigs.Events.CHANGE, updateGameConfigs(this));
    }

    onPlacingBet(betChoice: string) {
        this.emitEventConnection(HiLoEvents.deal, { betChoice: betChoice });
        this.resetCountdownTimer();
    }

    protected emitEventConnection(eventName, data) {
        if (!this.connection || !this.isReadyBet()) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        } else {
            this.lockBet();
            this.connection.emit(eventName, data);
        }
    }

    openHistory() {
        this.playClick();
    }

    showHideTopArea() {
        this.topNode.active = !this.topNode.active;
    }

    initBetBoard() {
        const betBoard = cc.instantiate(this.betBoardPrefab);
        this.betBoardComp = betBoard.getComponent(HiLoBetBoard);
        this.betBoardContainer.addChild(betBoard);
        this.betBoardComp.init((bet) => {
            this.onChangedBetChip(bet);
            this.stakesComp.betWin.string = bet.toString();
        });
    }

    showPlayGameButton(status: boolean) {
        this.playButton.node.active = status;
    }

    onPlayClick() {
        this.playClick();
        this.emitEventConnection(HiLoEvents.bet, { amount: this.currentBet });
    }

    onCollectClick() {
        this.playClick();
        this.resetCountdownTimer();
        this.emitEventConnection(HiLoEvents.collect, {});
    }

    enableAllBetOption(status: boolean) {
        this.bettingAreas.forEach((area) => {
            area.enableBetChoice(status);
        });
    }

    enableCollectButton(status: boolean) {
        this.collectButton && (this.collectButton.node.getChildByName("disabled-layer").active = !status);
    }

    showUserLoseMessage(status: boolean, animated = true) {
        if (animated) {
            this.userLose.opacity = status ? 0 : 255;
            this.userLose.scale = status ? 0 : 1;
            if (status) {
                cc.tween(this.userLose)
                    .to(0.3, { opacity: 255, scale: 1 }, { easing: "sineOut" })
                    .delay(this.userLoseMessageDuration)
                    .call(() => {
                        cc.tween(this.userLose).to(0.1, { opacity: 0, scale: 0 }, { easing: "sineIn" }).start();
                    })
                    .start();
            } else {
                cc.tween(this.userLose).to(0.3, { opacity: 0, scale: 0 }, { easing: "sineIn" }).start();
            }
        } else {
            if (status) {
                this.userLose.opacity = 255;
                this.userLose.scale = 1;
            } else {
                this.userLose.opacity = 0;
                this.userLose.scale = 0;
            }
        }
    }

    showWinningBet(bet: number) {
        // TODO: overide effect
        const winningBet = GameUtils.addFlyingText(this.noticeNode, true, bet, 1);
        winningBet.name = "winningBet";
    }

    showAcceptedBet(bet: number) {
        // TODO: overide effect
        GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
    }

    resetDataAndUI() {
        if (this.animatedTime) {
            this.resetCountdownTimer();
        }

        if (this.timeWaitNode) {
            this.timeWaitNode.active = false;
        }

        if (this.statusHandler) {
            this.statusHandler.currentStatusData = null;
        }
    }

    resetCountdownTimer() {
        this.animatedTime.setTime(numberPad(120, 2));
        this.isStopSchedule = true;
    }
}
