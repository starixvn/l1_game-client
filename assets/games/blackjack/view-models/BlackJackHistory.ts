import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import BlackJackHistoryItem from "./BlackJackHistoryItem";

const { ccclass } = cc._decorator;

@ccclass
export default class BlackJackHistory extends SocketIOGameHistoryBase {
    bindItemRowData(log, index) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(BlackJackHistoryItem);
        this.content.addChild(historyItemPrefab);
        item.setData(log);
    }
}
