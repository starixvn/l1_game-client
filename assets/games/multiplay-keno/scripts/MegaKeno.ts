import StatisticBoard from "../../../common/statistic-board/StatisticBoard";
import TableGameBase from "../../_base_new/view-models/TableGameBase";
import { KenoTableGameColor, MegaKeno1Id, MegaKeno3Id, MegaKeno4Id, MegaKenoConfigs } from "./MegaKenoConfig";
import MegaKenoSettlementResult from "./MegaKenoSettlementResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKeno extends TableGameBase {
    @property(cc.Node)
    timeShowResult: cc.Node = null;

    @property(cc.Node)
    settlementResultContainer: cc.Node = null;

    @property({ type: cc.Prefab })
    settlementResultPrefabs: cc.Prefab[] = [];

    bigSmallStatistic: StatisticBoard = null;
    evenOddStatistic: StatisticBoard = null;

    streakChoices = ["big", "small", "odd", "even"];
    //TODO:missing custom duration for Keno Mini
    showResultDuration = 6;

    settlementResultAnimation: MegaKenoSettlementResult;

    constructor() {
        super();
        this.gameId = MegaKeno1Id;
    }

    onLoad() {
        super.onLoad();
        this.animatedTime.setAnimatedY(30, -5);
    }

    setGameId(gameId: number) {
        this.gameId = gameId;
        this.config = MegaKenoConfigs[gameId];
        this.renderTableGame(gameId);
        this.initSettlementResultAnimation(gameId);
    }

    renderTableGame(gameId: number) {
        super.renderTableGame(gameId);
        this.tableGameBg && (this.tableGameBg.color = cc.Color.BLACK.fromHEX(KenoTableGameColor[gameId]));
    }

    onInitializeBigSmallStatistic(node: cc.Node) {
        this.bigSmallStatistic = node.getComponent(StatisticBoard);
        this.bigSmallStatistic.setSupportChoices("big,small");
        this.bigSmallStatistic.init(this);
    }

    onInitializeEvenOddStatistic(node: cc.Node) {
        this.evenOddStatistic = node.getComponent(StatisticBoard);
        this.evenOddStatistic.setSupportChoices("even,odd");
        this.evenOddStatistic.init(this);
    }

    initSettlementResultAnimation(gameId: number) {
        if (!this.settlementResultContainer || !this.settlementResultPrefabs.length) {
            return;
        }
        const isMini = gameId === MegaKeno3Id || gameId === MegaKeno4Id;
        const index = isMini ? 1 : 0;
        const node = cc.instantiate(this.settlementResultPrefabs[index]);
        this.settlementResultContainer.addChild(node);
        this.settlementResultAnimation = node.getComponent(MegaKenoSettlementResult);
        this.settlementResultAnimation.node.active = false;
    }

    showSettlementResult(settlement: any) {
        if (!this.settlementResultAnimation) {
            this.gameData.settlement.finishShowResult(settlement, true);
            return;
        }
        this.settlementResultAnimation.playResultAnimation(settlement, () => {
            this.settlementResultAnimation.hide();
            this.gameData.settlement.finishShowResult(settlement, true);
        });
    }
}
