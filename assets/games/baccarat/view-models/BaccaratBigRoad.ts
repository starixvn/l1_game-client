import { BigRoadScoreboardPoint, BigRoadScoreboard, Converter } from "sc-scoreboards";
import BigRoad from "../../../common/big-road/BigRoad";
import { BaccaratSettlementResult } from "./event-models/BaccaratSettlementResult";
import BaccaratBigRoadItem from "./BaccaratBigRoadItem";

const { ccclass } = cc._decorator;

class BaccaratBigRoadConverter extends Converter<BaccaratSettlementResult> {}

@ccclass
export default class BaccaratBigRoad extends BigRoad {
    protected isRenderedNext: boolean;

    onLoad() {
        super.onLoad();
        this.bigRoad = this.initialBigRoad();
        this.isRenderedNext = false;
    }

    initialBigRoad = () => {
        const converter = new BaccaratBigRoadConverter();

        return new BigRoadScoreboard({ height: 6, converter });
    };

    public renderScoreBoardInGame(data: any) {
        super.renderScoreBoardInGame(data);
    }

    public renderScoreBoardEachRound(round: BaccaratSettlementResult) {
        super.renderScoreBoardEachRound(round);
        this.isRenderedNext = false;
    }

    public renderNextNode() {
        if (this.isRenderedNext) {
            return;
        }
        let lastCol = 0;

        if (this.bigRoadData?.length) {
            const emptyIndex = this.bigRoadData[0].findIndex((data) => data.status === undefined);
            if (emptyIndex !== -1) {
                if (emptyIndex > 0 && !this.content.children[emptyIndex - 1].getComponent(BaccaratBigRoadItem).isFilledColumn()) {
                    lastCol = emptyIndex - 1;
                } else {
                    lastCol = emptyIndex;
                }
            } else {
                lastCol = this.bigRoadData[0].length - 1;
            }
            if (this.content.children[lastCol].getComponent(BaccaratBigRoadItem).isFilledColumn()) {
                lastCol += 1;
            }

            if (this.content.children[this.content.childrenCount - 1].getComponent(BaccaratBigRoadItem).isFilledColumn()) {
                this.updateContentChild(1);
                lastCol = this.content.childrenCount - 1;
                this.container.getComponent(cc.ScrollView).scrollToRight();
            }
        }

        const scoreBoardItem = this.content.children[lastCol].getComponent(BaccaratBigRoadItem);
        scoreBoardItem.renderNextNode();
        this.isRenderedNext = true;
    }

    protected updateScoreBoardUI(bigRoadMatrix: BigRoadScoreboardPoint<BaccaratSettlementResult>[][]) {
        super.updateScoreBoardUI(bigRoadMatrix);
        const bigRoadLength = bigRoadMatrix[0].length;
        const contentLength = this.content.childrenCount;

        this.updateContentChild(bigRoadLength - contentLength);

        for (let column = 0; column < bigRoadLength; column++) {
            const scoreboardItem = this.content.children[column];
            const scoreBoardItemWorker = scoreboardItem.getComponent(BaccaratBigRoadItem);
            for (let row = 0; row < 6; row++) {
                const bigRoadScoreBoardPoint = bigRoadMatrix[row][column];
                !this.firstRender && scoreBoardItemWorker.resetNode(bigRoadScoreBoardPoint);
                if (bigRoadScoreBoardPoint.status !== undefined) {
                    scoreBoardItemWorker.renderNode(bigRoadScoreBoardPoint);
                }
            }
        }

        this.container.getComponent(cc.ScrollView).scrollToRight();
    }
}
