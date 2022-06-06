import { BaccaratSettlementResult } from "./../../../../baccarat/view-models/event-models/BaccaratSettlementResult";
import BlockchainBaccaratBeadRoad from "./BlockchainBaccaratBeadRoad";
import BlockChainBaccaratBigRoad from "./BlockchainBaccaratBigRoad";
import BlockchainBaccaratDerivedScoreboard from "./BlockchainBaccaratDerivedScoreboard";
import BlockchainBaccaratScoreboardModel from "../event-model/BlockchainBaccaratScoreboardModel";
import { DerivedScoreboards } from "sc-scoreboards";
import { BasicHistoryData } from "../../../../_base/view-models/BasicHistoryBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratScoreboard extends cc.Component {
    @property(BlockChainBaccaratBigRoad)
    bigRoad: BlockChainBaccaratBigRoad = null;

    @property([BlockchainBaccaratDerivedScoreboard])
    derivedScoreboards: BlockchainBaccaratDerivedScoreboard[] = [];

    @property(BlockchainBaccaratBeadRoad)
    beadRoad: BlockchainBaccaratBeadRoad = null;

    model: BlockchainBaccaratScoreboardModel;

    derivedScoreBoardController: DerivedScoreboards<BaccaratSettlementResult>;

    constructor() {
        super();
        // this.model = new BlockchainBaccaratScoreboardModel();

        // this.model.on(BlockchainBaccaratScoreboardModel.Events.IN_GAME, (roundHistory) => {
        //     this.renderScoreBoardInGame(roundHistory);
        // });

        // this.model.on(BlockchainBaccaratScoreboardModel.Events.UPDATE_RESULT, (result) => {
        //     this.renderScoreBoardEachRound(result);
        // });
    }

    renderScoreBoardInGame(roundHistory: any[]) {
        this.bigRoad.renderScoreBoardInGame(roundHistory);
        this.derivedScoreBoardController = this.bigRoad.derivedScoreboards;
        this.renderDerivedScoreboard();
        this.renderBeadRoadInGame(roundHistory);
    }

    renderScoreBoardEachRound(lastRound: any) {
        this.bigRoad.renderScoreBoardEachRound(lastRound);
        this.renderDerivedScoreboard();
        this.renderBeadRoadEachRound(lastRound);
    }

    renderDerivedScoreboard() {
        this.derivedScoreboards.forEach((scoreboard) => {
            const data = this.derivedScoreBoardController?.getScoreboardData(scoreboard.nameBoard as any);
            scoreboard.renderScoreBoard(data);
        });
    }

    renderBeadRoadInGame(roundHistory: any[]) {
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

    renderBeadRoadEachRound(lastRound: any) {
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
        const value = card?.card;
        return value > 10 || !value ? 0 : value;
    }
}
