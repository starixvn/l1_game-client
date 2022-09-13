import { FruitSlotRoundHistory, FruitSlotBetHandler } from "./../event-handlers/FruitSlotHandler";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";
import FruitSlotBetOptionsUI from "./FruitSlotBetOptionsUI";
import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";
import FruitSlotGameData from "../event-models/FruitSlotGameData";
import { History } from "../../_new/_base/game-data-management/models/history";
import FruitSlotMiniRoundHistory from "./FruitSlotMiniRoundHistory";
import FruitSlotStatistic from "./FruitSlotStatistic";
import FruitSlotAnimatedTimer from "./FruitSlotAnimatedTimer";
import { updateWaiting } from "./FruitSlotRenderClock";
import { NewDurations } from "../../_base_new/models/NewDurations";
import GameUtils from "../../../common/GameUtils";
import NewButton from "../../../common/custom-button/NewButton";
import FruitSlotPlacingBet from "./FruitSlotPlacingBet";
import { FruitSlotChoicesConst } from "../event-models/FruitSlotChoices";
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { handleWaitingTime } from "../actions/FruitSlotCustomActions";

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
    timeWaitDot: cc.Node = null;

    @property(cc.Node)
    chipContainer: cc.Node = null;

    @property(cc.Node)
    ownBetContainer: cc.Node = null;

    @property(cc.Node)
    totalBetContainer: cc.Node = null;

    @property(cc.Node)
    timeShowResult: cc.Node = null;

    public gameData: FruitSlotGameData = null;
    public config: FruitSlotConfig;
    public betOptionsUI: FruitSlotBetOptionsUI = null;
    public miniRoundHistory: FruitSlotMiniRoundHistory = null;
    public statistic: FruitSlotStatistic = null;
    public timeHandler: FruitSlotTimeHandler;
    public animatedTime: FruitSlotAnimatedTimer = null;
    private placingBet: FruitSlotPlacingBet = null;
    emitterStorages: EmitterStorage[] = [];

    currentBetChoices: any = {};
    betChoicesStack = [];

    constructor() {
        super();
        this.gameId = FruitSlotGameId;
        this.setConfig(new FruitSlotConfig());
    }

    onLoad() {
        this.gameData = new FruitSlotGameData();
        super.onLoad();
        this.registerRoundHistoryEvents();
        this.registerDurationEvents();
        this.initStatistic();
        this.initGameDataEvents();
    }

    openStatistic() {
        this.playClick();
        this.statistic.node.active = true;
        this.statistic.render(this.gameData.roundHistory.list);
        this.statistic.commonDialog.showDialog();
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new FruitSlotTimeHandler(this);
        this.betHandler = new FruitSlotBetHandler(this);
    }

    emitterListener(emitter: EventEmitterBase, eventName: string, listener: (param: any) => any) {
        const storage = {
            emitter,
            eventName,
            listener: listener(this)
        };
        emitter.addListener(eventName, storage.listener);
        this.emitterStorages.push(storage);
        console.log("emitterListener");
    }

    initGameDataEvents() {
        console.log(this.gameData.durations);
        this.emitterListener(this.gameData.durations, Durations.Events.CHANGE_REMAINING_TIME, handleWaitingTime);
    }

    private initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(FruitSlotBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);

        this.betItems?.forEach((item) => {
            GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
            GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
            GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
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
        this.currentMiniPanel.addDialog(statisticNode);
    }

    private registerRoundHistoryEvents() {
        this.gameData.roundHistory.on(History.Events.CHANGE, (roundHistory: FruitSlotRoundHistory[]) => {
            this.miniRoundHistory.render(roundHistory);
        });
    }

    private registerDurationEvents() {
        console.log("registerDurationEvents", NewDurations.Events.WAITING);
        this.gameData.durations.on(NewDurations.Events.WAITING, updateWaiting(this));
    }

    timeAnimShowResult(show: boolean) {
        if (this.timeShowResult) {
            this.timeShowResult.active = show;
        }
    }

    // public disableButton(status: boolean) {
    //     const disableButton = "btn_disable";
    //     this.btnDouble.getChildByName(disableButton).active = status;
    //     this.btnRebet.getChildByName(disableButton).active = status;
    // }

    // public initButtonStatus() {
    //     console.log("button");
    //     const disableButton = "btn_disable";
    //     this.btnDouble.getComponent(NewButton).callback.selected = () =>
    //         !this.btnDouble.getChildByName(disableButton).active && this.onDoubleClick();

    //     this.btnRebet.getComponent(NewButton).callback.selected = () =>
    //         !this.btnRebet.getChildByName(disableButton).active && this.onRebetClick();
    // }

    onDoubleClick() {
        this.playClick();
        console.log(this.placingBet);
        this.placingBet.doubleBet(FruitSlotChoicesConst.big, this.gameData.placeBetModel.choices[FruitSlotChoicesConst.big]);
    }

    onRebetClick() {
        this.playClick();
        console.log("buttonRebet");
    }

    updateBetStatus(forceUpdate = false) {
        const disableButton = "btn_disable";
        if (this.currentTimeRemaining > this.config.betTime || !forceUpdate) {
            return;
        }

        const currentLength = Object.keys(this.currentBetChoices).length;
        this.btnDouble.node.active = !this.btnRebet.node.active;

        this.btnDouble.interactable = currentLength > 0;
        this.btnDouble.node.getChildByName(disableButton).active = !this.btnDouble.interactable;
    }

    addToBetChoicesStack(betChoices: any) {
        this.betChoicesStack.push(betChoices);
    }

    sumValueBetChoices(totalChoices: any) {
        let total = 0;
        for (const type in totalChoices) {
            for (const key in totalChoices[type]) {
                total += totalChoices[type][key];
            }
        }
        return total;
    }
}
