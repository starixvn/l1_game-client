import { ThreeCardsResultData } from "./DataDefinition";
import ThreeCardsResultItem from "./ThreeCardsResultItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsResultStatistics extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    setData(logs: ThreeCardsResultData[]) {
        this.content.destroyAllChildren();
        logs.forEach((log) => {
            this.addItem(log);
        });
    }

    addItem(log: ThreeCardsResultData): ThreeCardsResultItem {
        const node = cc.instantiate(this.itemPrefab);
        this.content.addChild(node);

        const item = node.getComponent(ThreeCardsResultItem);
        item.setData(log);
        return item;
    }
}
