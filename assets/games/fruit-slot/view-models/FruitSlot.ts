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
import { CountdownAnimationType } from "../FruitSlotType";

const { ccclass, property } = cc._decorator;
export const FruitSlotGameId = 59;

@ccclass
export default class FruitSlot extends NewGameRoomBase {
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

    @property(sp.Skeleton)
    animCountdownSkeleton: sp.Skeleton[] = [];

    @property(cc.Node)
    countdownLight: cc.Node = null;

    public gameData: FruitSlotGameData = null;
    public config: FruitSlotConfig;
    public betOptionsUI: FruitSlotBetOptionsUI = null;
    public miniRoundHistory: FruitSlotMiniRoundHistory = null;
    public statistic: FruitSlotStatistic = null;
    public timeHandler: FruitSlotTimeHandler;
    public animatedTime: FruitSlotAnimatedTimer = null;
    private placingBet: FruitSlotPlacingBet = null;
    public isShowAnimSettlement = false;

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
        this.initPlacingBet();
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
        });
    }

    private registerSettlementEvents() {
        this.gameData.settlement.on(Settlement.Events.SHOW_RESULT, (finish: FruitSlotFinishModel) => {
            handleShowResult(this)(finish);
            this.updateShowAnimSettlementStatus(true);
        });
        this.gameData.settlement.on(Settlement.Events.END_SHOW_RESULT, ({ settlement }: { settlement: FruitSlotFinishModel }) => {
            handleAfterSettlementResult(this)(settlement);
        });
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

    stopCountDownAnim(stop: boolean) {
        const anim = stop ? CountdownAnimationType.IDLE : CountdownAnimationType.PLAY;
        for (const animSymbol of this.animCountdownSkeleton) {
            animSymbol.setAnimation(0, anim, true);
        }
    }

    countdownLightAnim(isAnimated: boolean) {
        if (this.countdownLight) {
            this.countdownLight.active = isAnimated;
        }
    }

    updateShowAnimSettlementStatus(status = false) {
        this.isShowAnimSettlement = status;
    }
}
