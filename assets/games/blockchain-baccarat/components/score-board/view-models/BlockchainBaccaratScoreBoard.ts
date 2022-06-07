import { BlockchainBaccaratPrediction } from "./BlockchainBaccaratPrediction";
import { BaccaratSettlementResult } from "./../../../../baccarat/view-models/event-models/BaccaratSettlementResult";
import BlockchainBaccaratBeadRoad from "./BlockchainBaccaratBeadRoad";
import BlockChainBaccaratBigRoad from "./BlockchainBaccaratBigRoad";
import BlockchainBaccaratDerivedScoreboard from "./BlockchainBaccaratDerivedScoreboard";
import { DerivedScoreboards } from "sc-scoreboards";
import { BasicHistoryData } from "../../../../_base/view-models/BasicHistoryBoard";
import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratScoreboard extends cc.Component {
    @property(BlockChainBaccaratBigRoad)
    bigRoad: BlockChainBaccaratBigRoad = null;

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
    private readonly statisticChildrenName = {
        player: "player",
        banker: "banker",
        tie: "tie",
        playerPair: "playerPair",
        bankerPair: "bankerPair",
        big: "big",
        small: "small"
    };

    resetScoreboard(): void {
        // reset
        this.bigRoad.resetBoard();
        this.derivedScoreboards.forEach((scoreboard) => {
            scoreboard.resetBoard();
        });
        this.beadRoad.resetBoard();
        this.prediction.resetItem();
        this.resetStatistic();
    }

    renderScoreBoardInGame(roundHistory: BlockchainBaccaratRoundHistory[]) {
        this.roundHistory = roundHistory;
        this.bigRoad.renderScoreBoardInGame(roundHistory);
        this.derivedScoreBoardController = this.bigRoad.derivedScoreboards;
        this.renderDerivedScoreboard();
        this.renderBeadRoadInGame(roundHistory);
        this.renderPrediction();
        this.renderStatistic();
    }

    renderScoreBoardEachRound(lastRound: BlockchainBaccaratRoundHistory) {
        this.roundHistory.push(lastRound);
        this.bigRoad.renderScoreBoardEachRound(lastRound.settlementResult);
        this.renderDerivedScoreboard();
        this.renderBeadRoadEachRound(lastRound);
        this.renderPrediction();
    }

    renderDerivedScoreboard() {
        this.derivedScoreboards.forEach((scoreboard) => {
            const data = this.derivedScoreBoardController?.getScoreboardData(scoreboard.nameBoard as any);
            scoreboard.renderScoreBoard(data);
        });
    }

    private renderPrediction() {
        this.prediction.resetItem();
        const bankerData = this.derivedScoreBoardController.getPrediction(true);
        const playerData = this.derivedScoreBoardController.getPrediction(false);
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

    private resetStatistic() {
        for (const childName in this.statisticChildrenName) {
            this.statistic.getChildByName(childName).getComponent(cc.Label).string = "0";
        }
    }

    private renderBeadRoadInGame(roundHistory: BlockchainBaccaratRoundHistory[]) {
        const historyData = roundHistory.map((round) => {
            const result = round.result;
            const settlementResult = round.settlementResult;
            if (settlementResult?.player) {
                return new BasicHistoryData("player", this.calculateTotalScore(result.player));
            } else {
                if (settlementResult?.banker) {
                    return new BasicHistoryData("banker", this.calculateTotalScore(result.banker));
                } else {
                    if (settlementResult?.tie) {
                        return new BasicHistoryData("tie", this.calculateTotalScore(result.player));
                    }
                }
            }
            return new BasicHistoryData("0", "0");
        });
        this.beadRoad.render(historyData);
    }

    private renderBeadRoadEachRound(lastRound: BlockchainBaccaratRoundHistory) {
        let item;
        const result = lastRound.result;
        const settlementResult = lastRound.settlementResult;
        if (settlementResult?.player) {
            item = new BasicHistoryData("player", this.calculateTotalScore(result.player));
        } else {
            if (settlementResult?.banker) {
                item = new BasicHistoryData("banker", this.calculateTotalScore(result.banker));
            } else {
                if (settlementResult?.tie) {
                    item = new BasicHistoryData("tie", this.calculateTotalScore(result.player));
                }
            }
        }
        this.beadRoad.addNewItem(item);
    }

    calculateTotalScore(hand) {
        let value = 0;
        value += this.getValueCard(hand.card1);
        value += this.getValueCard(hand.card2);
        value += this.getValueCard(hand.card3);
        return (value % 10).toString();
    }

    getValueCard(card) {
        const value = card?.rank;
        return value > 10 || !value ? 0 : value;
    }
}
