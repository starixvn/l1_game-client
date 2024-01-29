import SocketIOGameHistoryItemGroupBase from "../../_base/view-models/SocketIOGameHistoryItemGroupBase";
import ChineseBlackjackHistoryItem, { IDataLog } from "./ChineseBlackjackHistoryItem";

const { ccclass } = cc._decorator;

@ccclass
export default class ChineseBlackjackHistoryItemGroup extends SocketIOGameHistoryItemGroupBase {
    addItem(log: IDataLog) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(ChineseBlackjackHistoryItem);
        this.bg.addChild(historyItemPrefab);
        item.setData(log);
        const rowHeight = 45;
        this.node.height = this.bg.childrenCount * rowHeight;
    }
}
