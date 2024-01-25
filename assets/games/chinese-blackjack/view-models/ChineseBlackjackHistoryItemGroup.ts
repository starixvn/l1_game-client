import SocketIOGameHistoryItemGroupBase from "../../_base/view-models/SocketIOGameHistoryItemGroupBase";
import ChineseBlackjackHistoryItem from "./ChineseBlackjackHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChineseBlackjackHistoryItemGroup extends SocketIOGameHistoryItemGroupBase {
    addItem(log) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(ChineseBlackjackHistoryItem);
        this.bg.addChild(historyItemPrefab);
        item.setData(log);
        const rowHeight = 45;
        this.node.height = this.bg.childrenCount * rowHeight;
    }
}
