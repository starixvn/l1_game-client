import BaccaratHistoryItem from "../../baccarat/view-models/BaccaratHistoryItem";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccaratHistory extends SocketIOGameHistoryBase {
    bindItemRowData(betLog, index) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(BaccaratHistoryItem);
        this.node.active = true;
        this.content.addChild(historyItemPrefab);
        item.setData(betLog, index);
    }
}
