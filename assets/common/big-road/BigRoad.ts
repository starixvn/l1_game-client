import { cloneDeep } from "lodash";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigRoad extends cc.Component {
    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(Number)
    minColumn = 15;

    @property(Number)
    scoreboardItemWidth = 22;

    @property(Number)
    scoreboardHeight = 133;

    @property(cc.Prefab)
    scoreboardItem: cc.Prefab;

    protected bigRoad: any;
    protected firstRender = true;
    protected bigRoadData: any[][];

    onLoad(): void {
        this.renderDefaultColumn();
    }

    protected renderScoreBoardInGame(data: any) {
        const clonedData = cloneDeep(data)
            .reverse()
            .map((round) => round.settlementResult);

        this.bigRoad.initialize(clonedData);
        this.bigRoadData = this.bigRoad.rows();
        this.updateScoreBoardUI(this.bigRoadData);
    }

    protected renderScoreBoardEachRound(round: any) {
        if (!round || !this.bigRoad) {
            return;
        }

        this.firstRender = false;
        this.bigRoad.fifo(cloneDeep(round));
        this.bigRoadData = this.bigRoad.rows();
        this.updateScoreBoardUI(this.bigRoadData);
    }

    protected updateScoreBoardUI(matrix: any) {
        // nothing
    }

    protected renderDefaultColumn() {
        let contentWidth = 0;
        for (let i = 0; i < this.minColumn; i++) {
            const scoreboardItem = cc.instantiate(this.scoreboardItem);
            this.content.addChild(scoreboardItem);
            contentWidth += this.scoreboardItemWidth;
            this.content.setContentSize(contentWidth, this.scoreboardHeight);
        }
    }

    protected updateContentChild(numberColumnDifferent: number) {
        let contentWidth = this.content.getContentSize().width;
        if (numberColumnDifferent > 0) {
            for (let i = 0; i < numberColumnDifferent; i++) {
                const scoreboardItem = cc.instantiate(this.scoreboardItem);
                this.content.addChild(scoreboardItem);
                contentWidth += this.scoreboardItemWidth;
                this.content.setContentSize(contentWidth, this.scoreboardHeight);
            }
        }

        if (numberColumnDifferent < 0) {
            for (let i = 0; i < Math.abs(numberColumnDifferent); i++) {
                if (this.content.childrenCount <= this.minColumn) return;
                this.content.children.pop();
                contentWidth -= this.scoreboardItemWidth;
                this.content.setContentSize(contentWidth, this.scoreboardHeight);
            }
        }
    }
}
