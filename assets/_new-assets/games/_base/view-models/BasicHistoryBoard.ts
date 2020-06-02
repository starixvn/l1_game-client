import BlinkNode from "../../../common/BlinkNode";
import GameBase from "../../_base/GameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import * as _ from "lodash";

const { ccclass, property } = cc._decorator;

export class BasicHistoryData {
    constructor(public name: string, public value: string) {
    }
}

@ccclass
export default class BasicHistoryBoard extends cc.Component {
    @property({ type: cc.Prefab })
    itemsPrefab: cc.Prefab = null;

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

    private items: cc.Node[];
    private main: GameBase = null;
    private dots: cc.Node[] = [];
    private nextMark: cc.Node = null;

    onLoad() {
        const itemsNode = cc.instantiate(this.itemsPrefab);
        this.items = itemsNode.children;
    }

    init(main: GameBase) {
        this.main = main;
    }

    public setData(historyData: BasicHistoryData[]) {
        this.dots.forEach(dot => {
            dot.removeFromParent();
            dot.destroy();
        });

        historyData.forEach((history) => {
            const historyItem = _.find(this.items, item => item.name.toLowerCase() === history.name);
            var historyDot = cc.instantiate(historyItem);
            historyDot.active = true;
            this.content.addChild(historyDot);
            this.dots.push(historyDot);
        });

        this.addNextMark();
    }



    update() {
        if (this.nextMark && this.nextMark.isValid) {
            if (this.main) {
                if (this.main.currentTimeRemaining < this.main.config.stopBetTime) {
                    this.nextMark.active = true;
                }
                else {
                    this.nextMark.active = false;
                }
            }
        }
    }

    private addNextMark() {
        this.nextMark = cc.instantiate(this.itemNext);
        this.nextMark.active = true;
        this.nextMark.addComponent(BlinkNode).interval = 0.5;
        this.content.addChild(this.nextMark);
    }
}
