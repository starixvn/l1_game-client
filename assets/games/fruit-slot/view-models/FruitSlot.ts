import { FruitSlotBetHandler } from "./../event-handlers/FruitSlotHandler";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";
import FruitSlotBetOptionsUI from "./FruitSlotBetOptionsUI";
import FruitSlotGameData from "../event-models/FruitSlotGameData";
import FruitSlotMiniRoundHistory from "./FruitSlotMiniRoundHistory";
import FruitSlotStatistic from "./FruitSlotStatistic";
import FruitSlotAnimatedTimer from "./FruitSlotAnimatedTimer";
import GameUtils from "../../../common/GameUtils";
import FruitSlotPlacingBet from "./FruitSlotPlacingBet";
import { FruitSlotChoicesConst } from "../event-models/FruitSlotChoices";
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import { Settlement } from "../../_base_new/models/Settlement";
import { handleRenderMiniRoundHistoryAndStatistic } from "../actions/FruitSlotJoinRoomActions";
import { handleAfterSettlementResult, handleShowResult, handleFirstLoadRoundHistory } from "../actions/FruitSlotFinishActions";
import FruitSlotBetItem from "./FruitSlotBetItem";
import FruitSlotChips from "./FruitSlotChips";
import FruitSlotSpinItem from "./FruitSlotSpinItem";
import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";
import NewButton from "../../../common/custom-button/NewButton";
import _ = require("lodash");
import { updateOwnBets } from "../actions/FruitSlotCustomActions";
import { i18n } from "../../../ClientModules";
import GameDataManager from "../../_base_new/models/GameDataManager";
import NewGameData from "../../_base_new/models/NewGameData";
import AudioManager from "../../../common/audio/AudioManager";
import FruitSlotHistory from "./FruitSlotHistory";

const { ccclass, property } = cc._decorator;
export const FruitSlotGameId = 59;
interface EmitterStorage {
    emitter: EventEmitterBase;
    eventName: string;
    listener: (param?: any) => void;
}

@ccclass
export default class FruitSlot extends NewGameRoomBase {
    @property(cc.Button)
    btnRebet: cc.Button = null;

    @property(cc.Button)
    btnDouble: cc.Button = null;

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
    public fruitSlotChips: FruitSlotChips;
    emitterStorages: EmitterStorage[] = [];

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
        this.updateBetStatus(true);
        this.schedule(this.updateBetStatus, 0.3, cc.macro.REPEAT_FOREVER, 1);
        this.initGameData();
        this.initGameDataEvents();
        this.initPlacingBet();
        this.initButtonStatus();
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

    initGameData() {
        const dataManager = GameDataManager.getInstance();
        let gameData = dataManager.getGameData(this.gameId);
        if (!gameData) {
            gameData = this.createGameData();
            dataManager.setGameData(this.gameId, gameData);
        }

        //this.gameData = gameData;
        this.gameData.durations.initialize({
            wholeRound: this.config.fullTime,
            placingBet: this.config.betTime,
            lockingBet: this.config.stopBetTime
        });

        this.gameData.durations.addEvent(
            Durations.Events.SHOW_ANIMATION,
            {
                startTimePoint: this.config.fullTime,
                endTimePoint: this.config.fullTime - this.showResultDuration + 1
            },
            null,
            Durations.Events.WAITING
        );

        this.gameData.durations.addEvent(
            Durations.Events.STARTING_ROUND,
            {
                startTimePoint: this.config.betTime + this.startRoundDuration,
                endTimePoint: this.config.betTime
            },
            Durations.Events.WAITING,
            Durations.Events.PLACING_BET
        );
    }

    emitterListener(emitter: EventEmitterBase, eventName: string, listener: (param: any) => any) {
        const storage = {
            emitter,
            eventName,
            listener: listener(this)
        };
        emitter.addListener(eventName, storage.listener);
        this.emitterStorages.push(storage);
    }

    initGameDataEvents() {
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.FIRST_LOAD, handleRenderMiniRoundHistoryAndStatistic);
        this.emitterListener(this.gameData.settlement, Settlement.Events.SHOW_RESULT, handleShowResult);
        this.emitterListener(this.gameData.settlement, Settlement.Events.END_SHOW_RESULT, handleAfterSettlementResult);
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.FIRST_LOAD, handleFirstLoadRoundHistory);
    }

    public initButtonStatus() {
        const disableButton = "btn-disable";
        this.btnDouble.node.on("click", this.onDoubleClick, this);
        this.btnRebet.node.on("click", this.onRebetClick, this);
    }

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

    onDoubleClick() {
        if (!this.isReadyBet()) {
            return;
        }

        this.playClick();
        this.betChips.playSingleChipsSound();
        this.lockBet();

        const { ownBets } = this.gameData.betModel;
        const ownBetTemp = Object.keys(ownBets).reduce(
            (attrs, key) => ({
                ...attrs,
                [key]: ownBets[key] * 2
            }),
            {}
        );

        const sum = this.sumValueBetChoices(ownBets);
        if (!this.checkAvailableBalance(sum, ownBets)) {
            return;
        }

        this.gameData.betModel.changeOwnBets(ownBetTemp);
        this.placeBet(ownBets);
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
            console.log(`seperateChips ${chips} `);
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
        return _.clone(this.betChips.chipValues)
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

    setBgVisibility(node: cc.Node, visible: boolean, animated = true) {
        if (animated) {
            cc.tween(node)
                .to(0.3, { opacity: visible ? 255 : 0 })
                .start();
        } else {
            node.opacity = visible ? 255 : 0;
        }
    }

    updateBetStatus(forceUpdate = false) {
        const disableButton = "btn_disable";
        if (this.currentTimeRemaining > this.config.betTime || !forceUpdate) {
            return;
        }

        const isEmptyBetChoice = _.isEmpty(this.gameData.betModel?.ownBets);
        this.btnRebet.interactable = isEmptyBetChoice && !_.isEmpty(this.previousRoundBetChoices);

        this.btnDouble.interactable = !isEmptyBetChoice;
        this.btnDouble.node.getChildByName(disableButton).active = !this.btnDouble.interactable;
    }

    clearTempBetChoices() {
        this.tempBetChoices = {};
    }

    onDestroy() {
        super.onDestroy();
        this.unschedule(this.updateBetStatus);
    }

    showResult(animated: boolean) {
        if (this.currentDataLogs.length > 0) {
            const { settlementResult } = this.currentDataLogs[0];
            if (animated) {
                this.betOptionsUI.highlightWinningChoice(settlementResult);
                console.log("this.betOptionsUI.highlightWinningChoice(settlementResult);");
                this.betItems.forEach((betItem: FruitSlotBetItem) => {
                    const nodeName = betItem.node.name;
                    betItem.node.opacity = 255;
                    betItem.setHighlight(true, true);
                });
            }
        }
    }
    highlightLastResult(animated: boolean) {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];

        if (dataLog) {
            this.betItems.forEach((betItem: FruitSlotBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(dataLog?.settlementResult[choice], false);
                console.log("this.betOptionsUI.highlightWinningChoice(settlementResult);");
            });
        }
    }
}
