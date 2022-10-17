import StatisticBoard from "../../../common/statistic-board/StatisticBoard";
import { ResultHash } from "../../_base_new/models/ResultHash";
import TableGameBase from "../../_base_new/view-models/TableGameBase";
import { updateMD5String } from "./actions/CustomCommonAction";
import { KenoTableGameColor, MegaKeno1Id, MegaKeno3Id, MegaKeno4Id, MegaKenoConfigs } from "./MegaKenoConfig";
import MegaKenoMd5 from "./MegaKenoMd5";
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
    protected override managedByContainer = true;
    startRoundDuration = 0;
    streakChoices = ["big", "small", "odd", "even"];

    settlementResultAnimation: MegaKenoSettlementResult;

    constructor() {
        super();
        this.gameId = MegaKeno1Id;
    }

    onLoad() {
        super.onLoad();
        this.animatedTime.setAnimatedY(30, -5);
    }

    initGameDataEvents() {
        super.initGameDataEvents();
        this.emitterListener(this.gameData.resultHash, ResultHash.Events.CHANGE, updateMD5String);
    }

    customShowResultDuration() {
        this.showResultDuration = 6;
        if (this.isMiniKeno(this.gameId)) {
            this.showResultDuration = 4;
        }
    }

    isMiniKeno(gameId: number) {
        return gameId === MegaKeno3Id || gameId === MegaKeno4Id;
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
        const index = this.isMiniKeno(gameId) ? 1 : 0;
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

    initMD5String(node: cc.Node) {
        this.md5Component = node.getChildByName("md5-content").getComponent(MegaKenoMd5);
    }

    updateRebetButtonStatus() {
        super.updateRebetButtonStatus();
        this.rebetButton && (this.rebetButton.node.getChildByName("disabled").active = !this.checkRebetStatus());
    }
}
