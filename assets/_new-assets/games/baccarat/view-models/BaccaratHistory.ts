import BlinkNode from "../../../common/BlinkNode";
import GameBase from "../../_base/GameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import * as _ from "lodash";

const { ccclass, property } = cc._decorator;

export class NormalHistoryData {
    constructor(public name: string, public value: string) {
    }
}

@ccclass
export default class BaccaratHistory extends cc.Component {

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
    private stopTime = 0;
    private resultTime = 0;
    private nextMark: cc.Node = null;
    private dots: cc.Node[] = [];

    init(main: GameBase) {
        this.main = main;
    }

    public setData(historyData: NormalHistoryData[]) {
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

        historyData.forEach((history, i) => {
            row++;

            if (row > this.RowMax) {
                row = 0;
                col++;
            }

            if (col > colMax) {
                colMax = col;
            }

            const historyItem = _.find(this.items, item => item.name.toLowerCase() === history.name);
            var historyDot = cc.instantiate(historyItem);
            historyDot.active = true;
            historyDot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);

            maxX = Math.max(maxX, historyDot.position.x);
            this.content.addChild(historyDot);
            this.dots.push(historyDot);
        });

        // this.addNextMark(rowMax, row, col, colMax, nextCol, start);

        maxX = Math.max(maxX, this.nextMark.position.x);
        this.content.width = Math.max(maxX + this.itemSize.width / 2, this.node.width) + 2 * this.padding.width;

        this.content.position = cc.v2(-this.content.width, this.content.position.y);
    }

    private addNextMark(rowMax, row, col, colMax, nextCol, start) {
        var max = rowMax.hasOwnProperty(col) ? rowMax[col] : this.RowMax;
        if (row < max - 1) {
            row++;
        } else {
            row = 0;
            col = nextCol;
            if (col > colMax) {
                colMax = col;
            }
        }
        var dot = cc.instantiate(this.itemNext);
        dot.active = false;
        dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);
        dot.addComponent(BlinkNode).interval = 0.5;
        this.content.addChild(dot);
        this.nextMark = dot;
        this.dots.push(dot);
    }

    update() {
        if (this.nextMark && this.nextMark.isValid) {
            // if (this.main) {
            //     if (this.main.currentTimeRemaining < this.main.config.stopBetTime ||
            //         this.main.currentTimeRemaining > this.main.config.fullTime - this.finishHandler.getResultAnimationTime()) {
            //         this.nextMark.active = true;
            //     }
            // } else if (this.oldGameMain) {
            //     if (this.oldGameMain.time_remain < this.stopTime || this.oldGameMain.time_remain > this.resultTime) {
            //         this.nextMark.active = true;
            //     }
            // }
        }
    }
}
