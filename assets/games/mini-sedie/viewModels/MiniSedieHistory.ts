import SedieHistoryBase from "../../_base/view-models/SedieHistoryBase";
import MiniSedieHistoryItem from "./MiniSedieHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniSedieHistory extends SedieHistoryBase {
    bindItemRowData(betLog, index) {
        const itemNode = this.bindCommonData(betLog, index);
        const item = itemNode.getComponent(MiniSedieHistoryItem);
        item.setData(betLog);
        this.content.addChild(itemNode);
    }
}
