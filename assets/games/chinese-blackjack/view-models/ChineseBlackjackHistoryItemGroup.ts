import SocketIOGameHistoryItemGroupBase from "../../_base/view-models/SocketIOGameHistoryItemGroupBase";
import ChineseBlackjackHistoryItem, { IDataLog } from "./ChineseBlackjackHistoryItem";

const { ccclass } = cc._decorator;

@ccclass
export default class ChineseBlackjackHistoryItemGroup extends SocketIOGameHistoryItemGroupBase {
    addItem(log: IDataLog, index?: number) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(ChineseBlackjackHistoryItem);
        this.bg.addChild(historyItemPrefab);
        item.setData(log);
        item.setBackground(index);
    }
}
