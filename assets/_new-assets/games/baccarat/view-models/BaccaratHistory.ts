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
    rowMax = 6;

    @property(cc.Size)
    itemSize: cc.Size = new cc.Size(22, 22);

    @property(cc.Size)
    padding: cc.Size = new cc.Size(2, 2);

    private main: GameBase = null;
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

        historyData.forEach((history, i) => {
            const historyItem = _.find(this.items, item => item.name.toLowerCase() === history.name);
            var historyDot = cc.instantiate(historyItem);
            historyDot.active = true;
            this.content.addChild(historyDot);
            this.dots.push(historyDot);
        });
    }

    private addNextMark(rowMax, row, col, colMax, nextCol, start) {
        var dot = cc.instantiate(this.itemNext);
        dot.active = false;
        dot.addComponent(BlinkNode).interval = 0.5;
        this.content.addChild(dot);
        this.nextMark = dot;
        this.dots.push(dot);
    }

    update() {
        if (this.nextMark && this.nextMark.isValid) {
            if (this.main) {
                if (this.main.currentTimeRemaining < this.main.config.stopBetTime ||
                    this.main.currentTimeRemaining > this.main.config.fullTime - this.main.finishHandler.getResultAnimationTime()) {
                    this.nextMark.active = true;
                }
            }
        }
    }
}
