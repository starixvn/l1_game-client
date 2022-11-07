import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import StandAloneTableGameHistoryItem from "./StandAloneTableGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandAloneTableGameHistory extends SocketIOGameHistoryBase {
    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(StandAloneTableGameHistoryItem);
        item.setData(betLog, index);
        this.content.addChild(itemNode);
    }
}
