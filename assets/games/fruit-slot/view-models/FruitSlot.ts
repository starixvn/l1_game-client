import { FruitSlotBetHandler } from "./../event-handlers/FruitSlotHandler";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";
import FruitSlotBetOptionsUI from "./FruitSlotBetOptionsUI";
import FruitSlotGameData from "../event-models/FruitSlotGameData";
import FruitSlotMiniRoundHistory from "./FruitSlotMiniRoundHistory";
import FruitSlotStatistic from "./FruitSlotStatistic";
import FruitSlotAnimatedTimer from "./FruitSlotAnimatedTimer";
import { updateWaiting } from "./FruitSlotRenderClock";
import { NewDurations } from "../../_base_new/models/NewDurations";
import GameUtils from "../../../common/GameUtils";
import FruitSlotPlacingBet from "./FruitSlotPlacingBet";
import { FruitSlotChoicesConst } from "../event-models/FruitSlotChoices";
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import { Settlement } from "../../_base_new/models/Settlement";
import { handleRenderMiniRoundHistoryAndStatistic, handleRenderOwnBet } from "../actions/FruitSlotJoinRoomActions";
import { handleAfterSettlementResult, handleShowResult } from "../actions/FruitSlotFinishActions";
import FruitSlotBetItem from "./FruitSlotBetItem";
import FruitSlotChips from "./FruitSlotChips";
import { BetModel } from "../../_base_new/models/BetModel";
import FruitSlotSpinItem from "./FruitSlotSpinItem";
import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";

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

    // @property(cc.Node)
    // chipContainer: cc.Node = null;

    @property(cc.Node)
    ownBetContainer: cc.Node = null;

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

    constructor() {
        super();
        this.gameId = FruitSlotGameId;
        this.setConfig(new FruitSlotConfig());
    }

    onLoad() {
        this.gameData = new FruitSlotGameData();
        super.onLoad();
        this.initStatistic();
        this.initGameDataEvents();
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
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.FIRST_LOAD, handleRenderMiniRoundHistoryAndStatistic);
        this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_OWN_CHIP_FAKE, handleRenderOwnBet);
        this.emitterListener(this.gameData.settlement, Settlement.Events.SHOW_RESULT, handleShowResult);
        this.emitterListener(this.gameData.settlement, Settlement.Events.END_SHOW_RESULT, handleAfterSettlementResult);
    }

    private initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(FruitSlotBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);

        this.betItems?.forEach((item) => {
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
        this.statistic.initMiniRoundHistory();
        this.currentMiniPanel.addDialog(statisticNode);
    }

    timeAnimShowResult(show: boolean) {
        this.timeShowResult.active = show;
    }

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

    showGenerateResult(finish: any) {
        this.timeAnimShowResult(true);
        this.finishShowResult = false;
        const delaySpinAnim = 5;
        const isLucky = finish.result.isLucky;
        this.setBgVisibility(this.betOptionsUI.spinOverlay, false);

        if (!isLucky) {
            cc.tween(this.spinItems)
                .call(() => {
                    this.betOptionsUI.spinItemAnimation(finish);
                    this.betOptionsUI.playLedLightAnimation();
                    this.betOptionsUI.randomNumberAnimation();
                })
                .delay(delaySpinAnim)
                .call(() => {
                    this.gameData.settlement.finishShowResult(finish, true);
                    this.betOptionsUI.ledLightAnimation.active = false;
                    this.betOptionsUI.highlightWinningChoice(finish);
                })
                .delay(1)
                .call(
                    () =>
                        (this.betOptionsUI.bigSmallResult.string =
                            finish.result.bigSmall.value < 10
                                ? "0" + finish.result.bigSmall.value.toString()
                                : finish.result.bigSmall.value.toString())
                )
                .delay(0.5)
                .call(() => this.showSettlementResult(finish))
                .start();
        }
    }

    showSettlementResult(finish: any) {
        const winChoice = finish;
        this.betOptionsUI.bigSmallResult.string = "00000";
        console.log("showSettlementResult", winChoice);
    }

    setBgVisibility(node: cc.Node, visible: boolean) {
        node.active = visible ? true : false;
    }
}
