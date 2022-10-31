import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";
import FruitSlotBetOptionsUI from "./FruitSlotBetOptionsUI";
import FruitSlotGameData from "../event-models/FruitSlotGameData";
import FruitSlotMiniRoundHistory from "./FruitSlotMiniRoundHistory";
import FruitSlotStatistic from "./FruitSlotStatistic";
import FruitSlotAnimatedTimer from "./FruitSlotAnimatedTimer";
import GameUtils from "../../../common/GameUtils";
import FruitSlotPlacingBet from "./FruitSlotPlacingBet";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import { Settlement } from "../../_base_new/models/Settlement";
import { FruitSlotFinishModel, handleAfterSettlementResult, handleShowResult } from "../actions/FruitSlotFinishActions";
import FruitSlotBetItem from "./FruitSlotBetItem";
import FruitSlotSpinItem from "./FruitSlotSpinItem";
import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";
import { i18n, lodash } from "../../../ClientModules";
import { FruitSlotRoundHistory } from "../event-models/FruitSlotRoundHistory";
import { FruitSlotBetHandler } from "../event-handlers/FruitSlotBetHandler";
import { updateWinning } from "../actions/FruitSlotWinningAction";

const { ccclass, property } = cc._decorator;
export const FruitSlotGameId = 59;

@ccclass
export default class FruitSlot extends NewGameRoomBase {
    @property(cc.Button)
    btnRebet: cc.Button = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Node)
    ownBetContainer: cc.Node = null;

    @property(cc.Node)
    chipContainer: cc.Node = null;

    @property(cc.Node)
    totalBetContainer: cc.Node = null;

    @property(cc.Node)
    timeShowResult: cc.Node = null;

    @property(cc.SpriteFrame)
    shadowChip: cc.SpriteFrame = null;

    @property({ type: [cc.Component] })
    protected bettingAreas: FruitSlotBetItem[] = [];

    @property({ type: FruitSlotSpinItem })
    spinItems: FruitSlotSpinItem[] = [];

    public gameData: FruitSlotGameData = null;
    public config: FruitSlotConfig;
    public betOptionsUI: FruitSlotBetOptionsUI = null;
    public miniRoundHistory: FruitSlotMiniRoundHistory = null;
    public statistic: FruitSlotStatistic = null;
    public timeHandler: FruitSlotTimeHandler;
    public animatedTime: FruitSlotAnimatedTimer = null;
    private placingBet: FruitSlotPlacingBet = null;

    currentBetChoices: any = {};
    betChoicesStack = [];
    tempBetChoices: any = {};

    startRoundDuration = 1;
    showResultDuration = 3;

    previousRoundBetChoices: any = {};
    constructor() {
        super();
        this.gameId = FruitSlotGameId;
        this.setConfig(new FruitSlotConfig());
    }

    onLoad() {
        this.gameData = new FruitSlotGameData();
        super.onLoad();
        this.initStatistic();
        //this.updateBetStatus(true);
        //this.schedule(this.updateBetStatus, 0.3, cc.macro.REPEAT_FOREVER, 1);
        this.initPlacingBet();
        //this.initButtonStatus();
        this.registerRoundHistoryEvents();
        this.registerSettlementEvents();
    }

    resetDataAndUI() {
        super.resetDataAndUI();
    }

    openStatistic() {
        this.playClick();
        this.statistic.node.active = true;
        this.statistic.commonDialog.showDialog();
    }

    initHandlers() {
        super.initHandlers();
        this.finishHandler = null;
        this.timeHandler = new FruitSlotTimeHandler(this);
        this.betHandler = new FruitSlotBetHandler(this);
    }

    private initPlacingBet() {
        this.placingBet = new FruitSlotPlacingBet(this.gameData, this, () => this.connection);
    }

    private registerRoundHistoryEvents() {
        this.gameData.roundHistory.on(RoundHistory.Events.CHANGE, (roundHistory: FruitSlotRoundHistory[]) => {
            this.miniRoundHistory?.render(roundHistory);
            this.statistic?.render(roundHistory);
            updateWinning(this.betOptionsUI, this.timeHandler)(roundHistory);
        });
    }

    private registerSettlementEvents() {
        this.gameData.settlement.on(Settlement.Events.SHOW_RESULT, (finish: FruitSlotFinishModel) => {
            handleShowResult(this)(finish);
        });
        this.gameData.settlement.on(Settlement.Events.END_SHOW_RESULT, ({ settlement }: { settlement: FruitSlotFinishModel }) => {
            handleAfterSettlementResult(this)(settlement);
        });
    }

    // public initButtonStatus() {
    //     this.btnRebet.node.on("click", this.onRebetClick, this);
    // }

    private initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(FruitSlotBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);

        this.betItems?.forEach((item) => {
            GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
            GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
            GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
        });
    }

    private initMiniRoundHistory(node: cc.Node) {
        this.miniRoundHistory = node.getComponent(FruitSlotMiniRoundHistory);
        this.miniRoundHistory.init(this);
    }

    private initStatistic() {
        const statisticNode = cc.instantiate(this.statisticPrefab);
        this.statistic = statisticNode.getComponent(FruitSlotStatistic);
        this.statistic.node.active = false;
        this.statistic.initMiniRoundHistory();
        this.currentMiniPanel.addDialog(statisticNode);
    }

    timeAnimShowResult(show: boolean) {
        this.timeShowResult.active = show;
    }

    onRebetClick() {
        if (!this.isReadyBet()) {
            return;
        }

        this.playClick();
        this.betChips.playSingleChipsSound();
        this.lockBet();

        this.gameData.betModel.changeOwnBets(this.previousRoundBetChoices);
        this.placeBet(this.previousRoundBetChoices);
    }

    placeBet(betChoices) {
        Object.keys(betChoices).forEach((choice) => {
            this.betHandler.handle({ ...this.gameData.betModel, betChoice: choice });

            const chips = this.seperateChips(betChoices[choice]);
            chips.forEach((chip) => {
                this.socket.emit("bet", {
                    betChoice: choice,
                    amount: chip,
                    username: cc.RedT.user.name
                });
            });
        });
    }

    checkAvailableBalance(bet: number, ownBetTemp): boolean {
        const total = this.sumValueBetChoices(ownBetTemp);
        const available = total + bet <= cc.RedT.user.red;

        !available && this.showMiniWarning(i18n.t("messages.notEnoughMoney"));

        return available;
    }

    sumValueBetChoices(totalChoices: any) {
        return Object.keys(totalChoices).reduce((total, key) => total + totalChoices[key], 0);
    }

    seperateChips(amount: number) {
        return lodash
            .clone(this.betChips.chipValues)
            .sort((a, b) => b - a)
            .reduce((chips, value) => {
                let chipsTmp = [];
                const numberOfChips = amount / value;
                if (numberOfChips > 0) {
                    for (let i = 0; i < Math.floor(numberOfChips); i++) {
                        amount = amount - value;
                        chipsTmp = chipsTmp.concat([value]);
                    }
                }

                return chips.concat(chipsTmp);
            }, []);
    }

    // updateBetStatus(forceUpdate = false) {
    //     if (this.currentTimeRemaining > this.config.betTime || !forceUpdate) {
    //         return;
    //     }

    //     const isEmptyBetChoice = lodash.isEmpty(this.gameData.betModel?.ownBets);
    //     this.btnRebet.interactable = isEmptyBetChoice && !lodash.isEmpty(this.previousRoundBetChoices);
    // }

    clearTempBetChoices() {
        this.tempBetChoices = {};
    }

    onDestroy() {
        super.onDestroy();
        //this.unschedule(this.updateBetStatus);
    }
}
