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
        value: "value"
    };

    private isSymbolMode = true;
    private items = null;
    private dots: cc.Node[] = [];

    onLoad(): void {
        const itemsNode = cc.instantiate(this.beadRoadItem);
        this.items = itemsNode.children;
    }

    render(data: BasicHistoryData[]) {
        data.forEach((history) => {
            this.addNewItem(history);
        });
    }

    addNewItem(history: BasicHistoryData) {
        const node = _.find(this.items, (item) => item.name.toLowerCase() === history.name);
        const dot = cc.instantiate(node);
        dot.active = true;
        dot.getChildByName(this.childrenItemKey.value).getComponent(cc.Label).string = history.value;
        this.content.addChild(dot);
        this.dots.push(dot);
    }

    resetBoard() {
        this.dots.forEach((dot) => {
            dot.removeFromParent();
            dot.destroy();
        });
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
