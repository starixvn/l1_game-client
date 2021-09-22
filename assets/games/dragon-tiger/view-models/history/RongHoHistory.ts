import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import RongHoHistoryItem from "./RongHoHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistory extends SocketIOGameHistoryBase {
    bindItemRowData(betLog) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(RongHoHistoryItem);
        item.setData(betLog);
        this.content.addChild(historyItemPrefab);
    }
}
