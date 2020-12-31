import BlinkNode from "../../../common/BlinkNode";
import DragonScoreBoardItem from "./DragonScoreBoardItem";

const { ccclass, property } = cc._decorator;

export class DragonScoreBoardItemData {
    constructor(public key: number, public isTie: boolean = false, public tieCount: number = 0, public isFirstTie = false) {}
}

@ccclass
export default class DragonScoreBoard extends cc.Component {
    @property({ type: DragonScoreBoardItem })
    items: DragonScoreBoardItem[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemNext: cc.Node = null;

    @property({ type: cc.Integer })
    RowMax = 6;

    @property(cc.Size)
    itemSize: cc.Size = new cc.Size(22, 22);

    @property(cc.Size)
    padding: cc.Size = new cc.Size(2, 2);

    private nextMark: cc.Node = null;
    private dots: cc.Node[] = [];
    private checkShowNext = () => false;

    init(condition: () => boolean) {
        this.checkShowNext = condition;
    }

    public setData(results: DragonScoreBoardItemData[]) {
        this.dots.forEach((dot) => {
            dot.removeFromParent();
            dot.destroy();
        });
        this.dots = [];

        let col = 0,
            row = 0;
        let maxX = 0;
        let nextCol = 1;
        let previousResult: DragonScoreBoardItemData = undefined;
        const rowMax = {};
        let colMax = 0;
        const start = cc.v2(-this.itemSize.width / 2 - this.padding.width, -this.itemSize.height / 2 - this.padding.height);

        results.forEach((result, i) => {
            if (this.compareResult(result, previousResult)) {
                const max = rowMax.hasOwnProperty(col) ? rowMax[col] : this.RowMax;

                if (row < max - 1) {
                    row++;
                } else if (row === 0 && max === 1) {
                    col = nextCol;
                    nextCol++;
                } else {
                    col++;
                    rowMax[col] = row;
                }
            } else {
                row = 0;
                col = nextCol;
                nextCol++;
            }

            if (col > colMax) {
                colMax = col;
            }

            previousResult = result;

            const item = this.buildItem(result);
            var dot = cc.instantiate(item.node);
            dot.active = true;
            dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);
            maxX = Math.max(maxX, dot.position.x);
            this.content.addChild(dot);
            this.dots.push(dot);
        });

        this.addNextMark(rowMax, row, col, colMax, nextCol, start);

        maxX = Math.max(maxX, this.nextMark.position.x);
        this.content.width = Math.max(maxX + this.itemSize.width / 2, this.node.width) + 2 * this.padding.width;

        this.content.position = cc.v2(-this.content.width, this.content.position.y);
    }

    protected buildItem(result: DragonScoreBoardItemData) {
        const item = this.items[result.key];
        item.tie.active = result.isTie;
        item.tieCount.node.active = result.isTie;
        item.tieCount.string = result.tieCount < 2 ? "" : result.tieCount.toString();
        item.main.active = !result.isFirstTie;
        return item;
    }

    protected compareResult(result: DragonScoreBoardItemData, previousResult: DragonScoreBoardItemData) {
        return previousResult && result.key === previousResult.key;
    }

    private addNextMark(rowMax, row, col, colMax, nextCol, start) {
        const max = rowMax.hasOwnProperty(col) ? rowMax[col] : this.RowMax;

        if (row < max - 1) {
            row++;
        } else {
            row = 0;
            col = nextCol;
            if (col > colMax) {
                colMax = col;
            }
        }

        const dot = cc.instantiate(this.itemNext);
        dot.active = false;

        if (row === 1 && col === 0) {
            // First dot
            col = 1;
            row = 0;
        }

        dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);

        dot.addComponent(BlinkNode).interval = 0.5;
        this.nextMark = dot;
        this.content.addChild(dot);
        this.dots.push(dot);
    }

    update() {
        if (this.nextMark && this.nextMark.isValid) {
            this.nextMark.active = this.checkShowNext();
        }
    }
}
