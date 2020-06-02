import BlinkNode from "../../../common/BlinkNode";
import GameBase from "../../_base/GameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DetailHistoryBoard extends cc.Component {

    @property({ type: cc.Node })
    items: cc.Node[] = [];

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

    private main: GameBase = null;
    private oldGameMain: any = null;
    private stopTime = 0;
    private resultTime = 0;
    private nextMark: cc.Node = null;
    private finishHandler: GameBaseFinishHandler;
    private dots: cc.Node[] = [];

    init(main: GameBase) {
        this.main = main;
        this.finishHandler = this.main.finishHandler as GameBaseFinishHandler;
    }

    initOldGame(main: any, stopTime: number, resultTime: number) {
        this.oldGameMain = main;
        this.stopTime = stopTime;
        this.resultTime = resultTime;
    }

    public setData(results: number[]) {
        this.dots.forEach(dot => {
            dot.removeFromParent();
            dot.destroy();
        });

        let col = 0, row = 0;
        let maxX = 0;
        let nextCol = 1;
        let previousResult = undefined;
        let rowMax = {};
        let colMax = 0;
        let start = cc.v2(-this.itemSize.width / 2, - this.itemSize.height / 2 - this.padding.height);

        results.forEach((result, i) => {
            if (this.compareResult(result, previousResult)) {
                let max = rowMax.hasOwnProperty(col) ? rowMax[col] : this.RowMax;

                if (row < max - 1) {
                    row++;
                } else if (row == 0 && max == 1) {
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

            console.log(result);
            var dot = cc.instantiate(this.items[result]);
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

    protected compareResult(result: number, previousResult: any) {
        return result == previousResult;
    }

    private addNextMark(rowMax, row, col, colMax, nextCol, start) {
        let max = rowMax.hasOwnProperty(col) ? rowMax[col] : this.RowMax;

        if (row < max - 1) {
            row++;
        } else {
            row = 0;
            col = nextCol;
            if (col > colMax) {
                colMax = col;
            }
        }

        let dot = cc.instantiate(this.itemNext);
        dot.active = false;
        dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);
        dot.addComponent(BlinkNode).interval = 0.5;
        this.content.addChild(dot);
        this.nextMark = dot;
        this.dots.push(dot);
    }

    update() {
        if (this.nextMark && this.nextMark.isValid) {
            if (this.main) {
                if (this.main.currentTimeRemaining < this.main.config.stopBetTime ||
                    this.main.currentTimeRemaining > this.main.config.fullTime - this.finishHandler.getResultAnimationTime()) {
                    this.nextMark.active = true;
                }
            } else if (this.oldGameMain) {
                if (this.oldGameMain.time_remain < this.stopTime || this.oldGameMain.time_remain > this.resultTime) {
                    this.nextMark.active = true;
                }
            }
        }
    }
}
