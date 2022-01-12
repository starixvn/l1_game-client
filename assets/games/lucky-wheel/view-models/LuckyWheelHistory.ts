import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import LuckyWheelHistoryItem from "./LuckyWheelHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    itemHistory: cc.Prefab = null;

    bindItemRowData(betLog: any) {
        const item = cc.instantiate(this.itemHistory);
        const component = item.getComponent(LuckyWheelHistoryItem);
        component.updateData(betLog);
        this.content.addChild(item);
    }
}
