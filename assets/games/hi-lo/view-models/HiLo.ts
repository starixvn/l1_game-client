import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { HiLoChoices } from "../events-models/HiLoChoices";
import HiLoGameData from "../events-models/HiLoGameData";
import { HiLoRoundCounter } from "../events-models/HiLoRoundCounter";
import { updateRoundId } from "../actions/HiLoRoundCounterAction";
import { HiLoResultModel } from "../events-models/HiLoResultModel";
import { updateStakes, updateCard, handleSettle, updateStatistic } from "../actions/HiLoDealAction";
import HiLoStakes from "./HiLoStakes";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { updateClockTime, updateCountdownTimer } from "../actions/HiLoCountdownTimerAction";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { GameIds } from "../../../configs/SabaConfigs";
import HiLoConfigs from "../events-models/HiLoConfigs";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import { handleGameState } from "../actions/HiLoBetAction";
import HiLoBettingArea, { BettingAreaEvents } from "./HiLoBettingArea";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLoResult from "./HiLoResult";
import _ = require("lodash");
import HiLoBetBoard from "./HiLoBetBoard";
import HiLoGameConfigs from "../events-models/HiLoGameConfigs";
import { updateGameConfigs } from "../actions/HiLoGameConfigsAction";
import { numberPad, numberWithCommas } from "../../../common/helpers/NumberHelper";
import HiLoTicketHistoryModel from "../events-models/HiLoTicketHistoryModel";
import { updateTicketHistory } from "../actions/HiLoTicketHistoryAction";
import HiLoTicketHistory from "./HiLoTicketHistory";
import HiLoTopArea from "./HiLoTopArea";

const { ccclass, property } = cc._decorator;

export const HiLoEvents = {
    bet: "bet",
    collect: "collect",
    deal: "deal",
    history: "getHistory"
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
    topArea: cc.Node = null;

    @property(cc.Prefab)
    topAreaPrefab: cc.Prefab = null;

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

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.BitmapFont)
    fontCong: cc.BitmapFont = null;

    @property(cc.BitmapFont)
    fontTru: cc.BitmapFont = null;

    gameData: HiLoGameData<HiLoChoices> = null;
    isStopSchedule = false;
    loseMessageEffectDuration = 1.5;
    newRoundAfterLossDelayTime = 2.5;
    winningEffectDuration = 1;
    deductingAmountEffectDuration = 1;
    spinCardsEffectDuration = 1.5;
    betBoardComp: HiLoBetBoard;
    ticketHistoryComp: HiLoTicketHistory;
    topAreaComp: HiLoTopArea;

    initMiniPanel(miniPanel: MiniPanel) {
        super.initMiniPanel(miniPanel);
        this.gameId = GameIds.HiLo;
        this.setConfig(new HiLoConfigs());
    }

    onLoad() {
        this.gameData = new HiLoGameData<HiLoChoices>(this);
        super.onLoad();
        this.showHideTopArea();
        this.initTopArea();
        this.registerResultEvents();
        this.registerStatusEvents();
        this.registerRoundCounterEvents();
        this.registerBettingAreaEvents();
        this.registerDurationsEvents();
        this.registerStateEvents();
        this.registerGameConfigsEvents();
        this.initBetBoard();
        this.addCountdownTimerSchedule();
        this.registerTicketHistoryEvent();
        this.topArea.active = true;
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

    protected initHandlers() {
        super.initHandlers();
        this.timeHandler = null;
        this.statusHandler = null;
    }

    protected clearIntervalAndTimeout() {}

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
            updateCard(this)(resultModel);
            updateCountdownTimer(this)(resultModel);
            updateStatistic(this)(resultModel);
        });
    }

    private registerStatusEvents() {
        this.gameData.statusModel.on(HiLoStatusModel.Events.CHANGE, (statusModel) => {
            handleSettle(this)(statusModel);
        });
    }

    private registerRoundCounterEvents() {
        this.gameData.roundCounter.on(HiLoRoundCounter.Events.CHANGE, updateRoundId(this.gameRound));
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

    private registerTicketHistoryEvent() {
        this.gameData.ticketHistory.on(HiLoTicketHistoryModel.Events.CHANGE, updateTicketHistory(this));
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
        this.initHistory();
    }

    private initHistory(pages = 1) {
        //this.connection.emit(HiLoEvents.history, { pages });
        const dialog = cc.instantiate(this.historyPrefab);
        this.ticketHistoryComp = dialog.getComponent(HiLoTicketHistory);
        this.ticketHistoryComp.setConnection(this.connection, this.gameName, this.gameData.roundCounter.roundId);
        this.ticketHistoryComp.get_data();
        this.currentMiniPanel.addDialog(dialog);
    }

    showHideTopArea() {
        this.topArea.active = !this.topArea.active;
    }

    initTopArea() {
        const node = cc.instantiate(this.topAreaPrefab);
        this.topAreaComp = node.getComponent(HiLoTopArea);
        this.topArea.addChild(node);
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

    enableAllBetOptions(status: boolean) {
        this.bettingAreas.forEach((area) => {
            area.enableBetChoice(status);
        });
    }

    enableCollectButton(status: boolean) {
        this.collectButton && (this.collectButton.node.getChildByName("disabled-layer").active = !status);
    }

    showUserLoseMessage(animated = true) {
        if (animated) {
            this.userLose.opacity = 0;
            this.userLose.scale = 0;
            const showMessageDuration = 0.3;
            const hideMessageDuration = 0.1;
            cc.tween(this.userLose)
                .delay(this.spinCardsEffectDuration - showMessageDuration)
                .to(showMessageDuration, { opacity: 255, scale: 1 }, { easing: "sineOut" })
                .delay(this.loseMessageEffectDuration)
                .call(() => {
                    cc.tween(this.userLose).to(hideMessageDuration, { opacity: 0, scale: 0 }, { easing: "sineIn" }).start();
                })
                .start();
        } else {
            this.userLose.opacity = 255;
            this.userLose.scale = 1;
        }
    }

    showWinningBet(bet: number) {
        const winningBet = this.addFlyingText(this.noticeNode, true, bet, this.winningEffectDuration);
        winningBet.name = "winningBet";
    }

    showAcceptedBet(bet: number) {
        this.addFlyingText(this.noticeNode, false, bet, 1);
    }

    addFlyingText(parent: cc.Node, win: boolean, value: number, duration = 1, startY = 0, destY = 100) {
        const temp = new cc.Node().addComponent(cc.Label);
        temp.string = (win ? "+" : "-") + numberWithCommas(value, 2);
        temp.font = win ? this.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 60;
        temp.node.position = cc.v3(0, startY, 0);
        parent.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(duration, cc.v2(0, startY + destY)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
        return temp.node;
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

        this.enableAllBetOptions(false);
        this.enableCollectButton(false);
        this.resetCountdownTimer();
        this.gameRound.string = "";
    }

    resetCountdownTimer() {
        this.animatedTime.setTime(numberPad(this.config.betTime, 2));
        this.isStopSchedule = true;
    }
}
