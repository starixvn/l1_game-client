import { DerivedScoreboardPoint, DerivedScoreboards } from "sc-scoreboards";
import BaccaratBigRoad from "../../../../baccarat/view-models/BaccaratBigRoad";
import { BaccaratSettlementResult } from "../../../../baccarat/view-models/event-models/BaccaratSettlementResult";
import BlockchainBaccaratDerivedScoreboardItem from "./BlockchainBaccaratDerivedScoreboardItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratDerivedScoreboard extends BaccaratBigRoad {
    @property(cc.String)
    nameBoard = "";

    derivedScoreboards: DerivedScoreboards<BaccaratSettlementResult>;

    public renderScoreBoard(data: DerivedScoreboardPoint[][]): void {
        if (data.length === 0) return;
        const dataLength = data[0].length;
        const contentLength = this.content.childrenCount;

        this.updateContentChild(Math.ceil(dataLength / 2) - contentLength);

        for (let column = 0; column < dataLength; column++) {
            const scoreboardItem = this.content.children[Math.floor(column / 2)];
            const scoreBoardItemWorker = scoreboardItem.getComponent(BlockchainBaccaratDerivedScoreboardItem);
            for (let row = 0; row < 6; row++) {
                const bigRoadScoreBoardPoint = data[row][column];
                !this.firstRender && scoreBoardItemWorker.resetNode(bigRoadScoreBoardPoint);
                if (bigRoadScoreBoardPoint.status !== undefined) {
                    scoreBoardItemWorker.renderNode(bigRoadScoreBoardPoint);
                }
            }
        }

        this.container?.getComponent(cc.ScrollView)?.scrollToRight();
    }

    resetBoard() {
        const contentLength = this.content.childrenCount;

        this.updateContentChild(this.minColumn - contentLength);
        for (let index; index < contentLength; index++) {
            this.content.children[index].getComponent(BlockchainBaccaratDerivedScoreboardItem).resetAll();
        }
    }
}
