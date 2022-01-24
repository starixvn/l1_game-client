import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { HiLoChoices } from "../events-models/HiLoChoices";
import HiLoGameData from "../events-models/HiLoGameData";
import { HiLoRoundCounter } from "../events-models/HiLoRoundCounter";
import { updateRoundId } from "../actions/HiLoRoundCounterAction";
import HiLoOwnBetModel from "../events-models/HiLoOwnBetModel";
import { HiLoResultModel } from "../events-models/HiLoResultModel";
import { updateHigherLowerStakes, updateAllStakes } from "../actions/HiLoDealAction";
import HiLoStakes from "./HiLoStakes";
import HiLoBettingArea from "./HiLoBettingArea";
import { BettingAreaEvents } from "./HiLoBettingArea";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { updateClockTime } from "../actions/HiLoCountdownTimerAction";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { GameIds } from "../../../configs/SabaConfigs";

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

    private gameData: HiLoGameData<HiLoChoices> = null;
    private betAmount: number = 0;
    private isStopSchedule = false;

    initMiniPanel(miniPanel: MiniPanel) {
        super.initMiniPanel(miniPanel);
        this.gameId = GameIds.HiLo;
        // this.setConfig(new BigSmallConfigs());
    }

    onLoad() {
        this.gameData = new HiLoGameData<HiLoChoices>();
        super.onLoad();
        this.showHideTopArea();
        this.initBetBoard();
        this.registerOwnBetEvents();
        this.registerResultEvents();
        this.registerRoundCounterEvents();
        this.registerBettingAreaEvents();
        this.registerDurationsEvents();
        this.initializeBetBoard();
    }

    onEnable() {
        super.onEnable();
        this.isStopSchedule = false;
    }

    onDisable() {
        super.onDisable();

        this.gameData.isProcessingBet = false;

        if (this.gameData) {
            this.gameData.durations.reset();
        }
    }

    private registerBettingAreaEvents() {
        this.bettingAreas.forEach((area) => {
            area.node.on(BettingAreaEvents.PLACING_BET, this.onPlacingBet, this);
        });
    }

    private registerOwnBetEvents() {
        this.gameData.ownBetModel.on(HiLoOwnBetModel.Events.CHANGE, (betModel: HiLoOwnBetModel) => {
            updateHigherLowerStakes(this.stakesComp);
        });
        this.gameData.ownBetModel.on(HiLoOwnBetModel.Events.CHANGE, () => {
            this.gameData.roundCounter.change(this.gameData.ownBetModel.roundId);
        });
    }

    private registerResultEvents() {
        this.gameData.resultModel.on(HiLoResultModel.Events.CHANGE, () => {
            updateAllStakes(this.stakesComp);
        });
    }

    private registerRoundCounterEvents() {
        this.gameData.roundCounter.on(HiLoRoundCounter.Events.CHANGE, updateRoundId(this.gameRound));
    }

    private registerDurationsEvents() {
        this.gameData.durations.on(Durations.Events.LOCKING_BET, updateClockTime(this.animatedTime));
        // this.gameData.durations.on(Durations.Events.LOCKING_BET, hideSettlementResultNode(this.settlement));

        // this.gameData.durations.on(Durations.Events.PLACING_BET, updateClockTime(this.clock));
        // this.gameData.durations.on(Durations.Events.PLACING_BET, hideSettlementResultNode(this.settlement));
        // this.gameData.durations.on(Durations.Events.PLACING_BET, changeToNormalTheme(this.bettingAreas));

        // this.gameData.durations.on(Durations.Events.WAITING, hideClock(this.clock));
        // this.gameData.durations.on(Durations.Events.WAITING, updateWaitingLabel(this.settlement));
        // this.gameData.durations.on(Durations.Events.WAITING, this.triggerAt(2, showSettlementResult(this.settlement)));

        // this.gameData.durations.on(Durations.Events.SHOW_ANIMATION, startBlinkNote(this.scoreBoard));
        // this.gameData.durations.on(Durations.Events.SHOW_ANIMATION, hideWaitingLabel(this.settlement));
        // this.gameData.durations.on(Durations.Events.BEGIN_SHOW_ANIMATION, showAnimation(this.settlement));
        // this.gameData.durations.on(Durations.Events.SHOW_ANIMATION, hideClock(this.clock));

        // this.gameData.durations.on(Durations.Events.BEGIN_PLACING_BET, this.guideMessage.showPlaceYourBetMessage.bind(this.guideMessage));
        // this.gameData.durations.on(Durations.Events.BEGIN_LOCKING_BET, this.guideMessage.showNoMoreBetMessage.bind(this.guideMessage));

        // this.gameData.durations.on(
        //     Durations.Events.BEGIN_PLACING_BET,
        //     getGameConfigs(() => this.connection)
        // );

        // this.gameData.durations.on(Durations.Events.BEGIN_PLACING_BET, () => {
        //     this.deviceSetting.sounds.play(SoundKeys.newRound);
        // });

        // this.gameData.durations.on(
        //     Durations.Events.WAITING,
        //     this.triggerAt(2, () => (this.gameData.isProcessingBet = false))
        // );

        // this.gameData.durations.on(Durations.Events.TIMEOUT, hideClock(this.clock));
        // this.gameData.durations.on(Durations.Events.TIMEOUT, hideSettlementResultNode(this.settlement));
        // this.gameData.durations.on(Durations.Events.TIMEOUT, changeToNormalTheme(this.bettingAreas));
    }

    private initializeBetBoard() {}

    onPlacingBet(betChoice: string) {
        if (!this.connection) {
            return;
        }
        this.gameData.isProcessingBet = true;
        this.connection.emit(HiLoEvents.deal, { choice: betChoice });
    }

    openHistory() {
        this.playClick();
    }

    showHideTopArea() {
        this.topNode.active = !this.topNode.active;
    }

    initBetBoard() {
        const betBoard = cc.instantiate(this.betBoardPrefab);
        this.betBoardContainer.addChild(betBoard);
    }

    showPlayGameButton(status: boolean) {
        this.playButton.node.active = status;
    }

    onPlayClick() {
        this.playClick();
        if (!this.connection) {
            return;
        }
        this.gameData.isProcessingBet = true;
        this.connection.emit(HiLoEvents.bet, { amount: this.betAmount });
        this.disableAllBetOption(false);
        this.disableCollectButton(false);
        this.showPlayGameButton(false);
    }

    onCollectClick() {
        this.playClick();
        if (!this.connection) {
            return;
        }
        this.gameData.isProcessingBet = true;
        this.connection.emit(HiLoEvents.collect, {});
        this.disableAllBetOption(true);
        this.disableCollectButton(true);
    }

    disableAllBetOption(status: boolean) {
        this.bettingAreas.forEach((area) => {
            area.disableBetChoice(status);
        });
    }

    disableCollectButton(status: boolean) {
        this.collectButton && (this.collectButton.node.getChildByName("disabled-layer").active = status);
    }
}
