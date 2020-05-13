import BlinkNode from "../../../common/BlinkNode";
import GameBase from "../../_base/GameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LogControl extends cc.Component {

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
    private nextMark: cc.Node = null;

    init(main: GameBase) {
        this.main = main;
    }

    public setData(results: number[]) {
        this.content.children.forEach(child => child.destroy());

        var col = 0, row = 0;
        var maxX = 0;
        var nextCol = 1;
        var previousResult = undefined;
        var rowMax = {};
        var colMax = 0;
        var start = cc.v2(-this.itemSize.width / 2, - this.itemSize.height / 2 - this.padding.height);
        results.forEach((result, i) => {
            if (result == previousResult) {
                var max = rowMax.hasOwnProperty(col) ? rowMax[col] : this.RowMax;
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

            var dot = cc.instantiate(this.items[result]);
            dot.active = true;

            dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);

            maxX = Math.max(maxX, dot.position.x);
            this.content.addChild(dot);
        });

        this.addNextMark(rowMax, row, col, colMax, nextCol, start);

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
    }

    update() {
        if (this.main) {
            if (this.nextMark && this.nextMark.isValid) {
                if (this.main.currentTimeRemaining == this.main.config.stopBetTime - 1) {
                    this.nextMark.active = true;
                }
            }
        }
    }
}
