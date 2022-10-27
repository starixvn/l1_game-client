import GameIdSprite from "../../../common/GameIdSprite";
import StatisticBoard from "../../../common/statistic-board/StatisticBoard";
import TableGameBase from "../../_base_new/view-models/TableGameBase";
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

    @property(GameIdSprite)
    gameNameTitleBg: GameIdSprite = null;

    bigSmallStatistic: StatisticBoard = null;
    evenOddStatistic: StatisticBoard = null;
    protected override managedByContainer = true;
    startRoundDuration = 0;
    streakChoices = ["big", "small", "odd", "even"];

    settlementResultAnimation: MegaKenoSettlementResult;
    settlementEndResult: MegaKenoSettlementResult;

    constructor() {
        super();
        this.gameId = MegaKeno1Id;
    }

    onLoad() {
        super.onLoad();
        this.animatedTime.setAnimatedY(30, -5);
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
        this.renderTitleGameBg(gameId);
        this.initSettlementResultAnimation(gameId);
    }

    renderTitleGameBg(gameId: number) {
        if (this.gameNameTitleBg) {
            this.gameNameTitleBg.prefix = `main_table_bgtitle_`;

            switch (gameId) {
                case 52:
                case 53:
                    this.gameNameTitleBg.gameId = 52;
                    break;
                case 14:
                case 15:
                    this.gameNameTitleBg.gameId = 14;
                    break;
                case 16:
                case 17:
                case 18:
                case 19:
                    this.gameNameTitleBg.gameId = 16;
                    break;
            }
        }
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
            this.settlementEndResult && this.settlementEndResult.showResult(settlement);
            this.gameData.settlement.finishShowResult(settlement, true);
        });
    }

    initMD5String(node: cc.Node) {
        this.md5Component = node.getChildByName("md5-content").getComponent(MegaKenoMd5);
    }

    override showUmMessage(data: any) {
        if (this.isDisableGame) {
            return;
        }

        this.umNotice && this.umNotice.show(data);
        this.onUmCallback(this.gameId, data);
    }

    initSettlementEndResult(node: cc.Node) {
        this.settlementEndResult = node.getComponent(MegaKenoSettlementResult);
        this.settlementEndResult.node.active = false;
    }

    clearData() {
        super.clearData();
        this.settlementEndResult && this.settlementEndResult.hide();
    }

    handleAfterSettlementResult(settlement: any) {
        super.handleAfterSettlementResult(settlement, false);
        this.settlementEndResult && this.settlementEndResult.showResult(settlement);
    }
}
