import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import ThreeCardsHistoryItem from "./ThreeCardsHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsHistory extends SocketIOGameHistoryBase {
    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(ThreeCardsHistoryItem);
        item.setData(betLog);
        this.content.addChild(itemNode);
    }
}
