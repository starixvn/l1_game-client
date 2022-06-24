import * as _ from "lodash";
import { BasicHistoryData } from "../../../../_base/view-models/BasicHistoryBoard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratBeadRoad extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    beadRoadItem: cc.Prefab = null;

    private readonly childrenItemKey = {
        symbol: "symbol",
        number: "number",
        value: "value",
        playerPair: "playerPair",
        bankerPair: "bankerPair"
    };
    private readonly maxItems = 60;

    private isSymbolMode = true;
    private items = null;
    private dots: cc.Node[] = [];
    private isRenderNext = false;

    onLoad(): void {
        const itemsNode = cc.instantiate(this.beadRoadItem);
        this.items = itemsNode.children;
    }

    render(data: BasicHistoryData[]) {
        while (data.length > this.maxItems) {
            data.pop();
        }
        data.reverse();
        data.forEach((history) => {
            this.addNewItem(history);
        });
    }

    addNewItem(history: BasicHistoryData) {
        if (this.isRenderNext) {
            this.dots[this.dots.length - 1].removeFromParent();
            this.dots[this.dots.length - 1].destroy();
            this.dots.pop();
            this.isRenderNext = false;
        }
        const node = _.find(this.items, (item) => item.name.toLowerCase() === history.name);
        const dot = cc.instantiate(node);
        dot.active = true;
        dot.getChildByName(this.childrenItemKey.value).getComponent(cc.Label).string = history.value;
        dot.getChildByName(this.childrenItemKey.symbol).active = this.isSymbolMode;
        dot.getChildByName(this.childrenItemKey.number).active = !this.isSymbolMode;
        dot.getChildByName(this.childrenItemKey.value).active = !this.isSymbolMode;
        dot.getChildByName(this.childrenItemKey.playerPair).active = history.playerPair;
        dot.getChildByName(this.childrenItemKey.bankerPair).active = history.bankerPair;
        this.content.addChild(dot);
        this.dots.push(dot);
    }

    addNextNode() {
        if (this.isRenderNext) {
            return;
        }
        while (this.dots.length > this.maxItems - 1) {
            this.dots[0].removeFromParent();
            this.dots[0].destroy();
            this.dots.shift();
        }
        this.isRenderNext = true;
        const node = _.find(this.items, (item) => item.name.toLowerCase() === "next");
        const dot = cc.instantiate(node);
        dot.active = true;
        this.content.addChild(dot);
        this.dots.push(dot);
    }

    resetBoard() {
        this.dots.forEach((dot) => {
            dot.removeFromParent();
            dot.destroy();
        });
        this.dots = [];
        this.isRenderNext = false;
    }

    changeMode() {
        this.isSymbolMode = !this.isSymbolMode;
        this.dots.forEach((dot) => {
            if (dot.childrenCount > 0) {
                dot.getChildByName(this.childrenItemKey.symbol).active = this.isSymbolMode;
                dot.getChildByName(this.childrenItemKey.number).active = !this.isSymbolMode;
                dot.getChildByName(this.childrenItemKey.value).active = !this.isSymbolMode;
            }
        });
    }
}
