import { BlockchainBaccaratPrediction } from "./BlockchainBaccaratPrediction";
import { BaccaratSettlementResult } from "./../../../../baccarat/view-models/event-models/BaccaratSettlementResult";
import BlockchainBaccaratBeadRoad from "./BlockchainBaccaratBeadRoad";
import BlockChainBaccaratBigRoad from "./BlockchainBaccaratBigRoad";
import BlockchainBaccaratDerivedScoreboard from "./BlockchainBaccaratDerivedScoreboard";
import { BigRoadScoreboardPoint, DerivedScoreboards } from "sc-scoreboards";
import { BasicHistoryData } from "../../../../_base/view-models/BasicHistoryBoard";
import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratScoreboard extends cc.Component {
    @property([BlockChainBaccaratBigRoad])
    bigRoads: BlockChainBaccaratBigRoad[] = [];

    @property([BlockchainBaccaratDerivedScoreboard])
    derivedScoreboards: BlockchainBaccaratDerivedScoreboard[] = [];

    @property(BlockchainBaccaratBeadRoad)
    beadRoad: BlockchainBaccaratBeadRoad = null;

    @property(BlockchainBaccaratPrediction)
    prediction: BlockchainBaccaratPrediction = null;

    @property(cc.Node)
    statistic: cc.Node = null;

    derivedScoreBoardController: DerivedScoreboards<BaccaratSettlementResult>;

    private roundHistory: BlockchainBaccaratRoundHistory[] = [];
    private bigRoadData: BigRoadScoreboardPoint<BaccaratSettlementResult>[][];
    private predictData = { player: [], banker: [] };

    private zoomModes = {
        normal: "normal",
        zoomInBigRoad: "zoomInBigRoad",
        zoomInDerivedScoreboards: "zoomInDerivedScoreboards"
    };

    private readonly statisticChildrenName = {
        player: "player",
        banker: "banker",
        tie: "tie",
        playerPair: "playerPair",
        bankerPair: "bankerPair",
        big: "big",
        small: "small"
    };

    protected onLoad(): void {
        this.derivedScoreBoardController = new DerivedScoreboards({ height: 6 });
    }

    protected start(): void {
        this.zoom(undefined, this.zoomModes.normal);
    }

    resetScoreboard(): void {
        this.roundHistory = [];
        this.bigRoadData = [];
        this.bigRoads.forEach((board) => {
            board.resetBoard();
        });
        this.derivedScoreboards.forEach((scoreboard) => {
            scoreboard.resetBoard();
        });
        this.beadRoad.resetBoard();
        this.prediction.resetItem();
        this.predictData = { player: [], banker: [] };
        this.resetStatistic();
    }

    renderScoreBoardInGame(roundHistory: BlockchainBaccaratRoundHistory[]) {
        this.roundHistory = roundHistory;
        this.bigRoads.forEach((board) => {
            board.renderScoreBoardInGame(roundHistory);
        });
        this.bigRoadData = this.bigRoads[0].getData();
        this.renderDerivedScoreboard();
        this.renderBeadRoadInGame(roundHistory);
        this.renderPrediction();
        this.renderStatistic();
    }

    renderScoreBoardEachRound(lastRound: BlockchainBaccaratRoundHistory) {
        this.roundHistory.unshift(lastRound);
        this.bigRoads.forEach((board) => {
            board.renderScoreBoardInGame(this.roundHistory);
        });
        this.bigRoadData = this.bigRoads[0].getData();
        this.renderDerivedScoreboard();
        this.renderBeadRoadEachRound(lastRound);
        this.renderPrediction();
        this.renderStatistic();
    }

    renderNextNode() {
        this.bigRoads.forEach((board) => {
            board.renderNextNode();
        });
        this.derivedScoreboards.forEach((board, index) => {
            this.predictData.player[index % 3] !== undefined && board.addNextNode();
        });
        this.beadRoad.addNextNode();
    }

    private renderDerivedScoreboard() {
        this.derivedScoreBoardController.update(this.bigRoadData);
        this.derivedScoreboards.forEach((scoreboard) => {
            const data = this.derivedScoreBoardController.getScoreboardData(scoreboard.nameBoard as any);
            scoreboard.renderScoreBoard(data);
        });
    }

    private renderPrediction() {
        this.prediction.resetItem();
        const bankerData = this.derivedScoreBoardController.getPrediction(true);
        const playerData = this.derivedScoreBoardController.getPrediction(false);
        this.predictData.player = playerData;
        this.predictData.banker = bankerData;
        this.prediction.setBanker(bankerData);
        this.prediction.setPlayer(playerData);
    }

    private renderStatistic() {
        const data = this.roundHistory.reduce(
            (total, round) => {
                for (const key in total) {
                    total[key] += +round.settlementResult[key];
                }
                return total;
            },
            {
                player: 0,
                banker: 0,
                tie: 0,
                playerPair: 0,
                bankerPair: 0,
                big: 0,
                small: 0
            }
        );

        for (const childName in this.statisticChildrenName) {
            this.statistic.getChildByName(childName).getComponent(cc.Label).string = data[childName].toString();
        }
    }

    private renderBeadRoadInGame(roundHistory: BlockchainBaccaratRoundHistory[]) {
        const historyData = roundHistory.map((round) => {
            return this.convertToBasicHistoryData(round);
        });
        this.beadRoad.render(historyData);
    }

    private renderBeadRoadEachRound(lastRound: BlockchainBaccaratRoundHistory) {
        const item = this.convertToBasicHistoryData(lastRound);
        this.beadRoad.addNewItem(item);
    }

    private convertToBasicHistoryData(round: BlockchainBaccaratRoundHistory) {
        const result = round.result;
        const settlementResult = round.settlementResult;
        if (settlementResult?.player) {
            return new BasicHistoryData(
                "player",
                this.calculateTotalScore(result.player),
                settlementResult.playerPair,
                settlementResult.bankerPair
            );
        } else {
            if (settlementResult?.banker) {
                return new BasicHistoryData(
                    "banker",
                    this.calculateTotalScore(result.banker),
                    settlementResult.playerPair,
                    settlementResult.bankerPair
                );
            } else {
                return new BasicHistoryData(
                    "tie",
                    this.calculateTotalScore(result.player),
                    settlementResult.playerPair,
                    settlementResult.bankerPair
                );
            }
        }
    }

    private calculateTotalScore(hand) {
        let value = 0;
        value += this.getValueCard(hand.card1);
        value += this.getValueCard(hand.card2);
        value += this.getValueCard(hand.card3);
        return (value % 10).toString();
    }

    private getValueCard(card) {
        const value = card?.rank + 1;
        return value > 10 || !value ? 0 : value;
    }

    private resetStatistic() {
        for (const childName in this.statisticChildrenName) {
            this.statistic.getChildByName(childName).getComponent(cc.Label).string = "0";
        }
    }

    zoom(event: any, mode: string) {
        switch (mode) {
            case this.zoomModes.normal:
                this.node.getChildByName(this.zoomModes.normal).active = true;
                this.node.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.node.getChildByName(this.zoomModes.zoomInDerivedScoreboards).active = false;
                this.runActionZoom(this.node.getChildByName(this.zoomModes.normal));
                break;

            case this.zoomModes.zoomInBigRoad:
                this.node.getChildByName(this.zoomModes.normal).active = false;
                this.node.getChildByName(this.zoomModes.zoomInBigRoad).active = true;
                this.node.getChildByName(this.zoomModes.zoomInDerivedScoreboards).active = false;
                this.runActionZoom(this.node.getChildByName(this.zoomModes.zoomInBigRoad));
                break;

            case this.zoomModes.zoomInDerivedScoreboards:
                this.node.getChildByName(this.zoomModes.normal).active = false;
                this.node.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.node.getChildByName(this.zoomModes.zoomInDerivedScoreboards).active = true;
                this.runActionZoom(this.node.getChildByName(this.zoomModes.zoomInDerivedScoreboards));
                break;
        }
    }

    runActionZoom(node: cc.Node) {
        node.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    node.setScale(0.5, 0.5);
                }),
                cc.scaleTo(0.2, 1, 1)
            )
        );
    }
}
