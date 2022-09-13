import StatisticBoard from "../../../common/statistic-board/StatisticBoard";
import TableGameBase from "../../_base_new/view-models/TableGameBase";
import { KenoTableGameColor, MegaKeno1Id, MegaKenoConfigs } from "./MegaKenoConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKeno extends TableGameBase {
    @property(cc.Node)
    tableGameBg: cc.Node = null;

    @property(cc.Node)
    timeShowResult: cc.Node = null;

    bigSmallStatistic: StatisticBoard = null;
    evenOddStatistic: StatisticBoard = null;

    constructor() {
        super();
        this.gameId = MegaKeno1Id;
    }

    setGameId(gameId: number) {
        this.gameId = gameId;
        this.config = MegaKenoConfigs[gameId];
        this.renderTableGame(gameId);
    }

    renderTableGame(gameId: number) {
        if (this.tableGameBg) {
            this.tableGameBg.color = cc.Color.BLACK.fromHEX(KenoTableGameColor[gameId]);
        }
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
}
