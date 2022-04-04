import SedieHistory from "./SedieHistory";
import SedieHistoryPortraitItem from "./SedieHistoryPortraitItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistoryPortrait extends SedieHistory {
    bindItemRowData(betLog, index) {
        const itemNode = this.bindCommonData(betLog, index);
        const item = itemNode.getComponent(SedieHistoryPortraitItem);
        item.setData(betLog);
        this.content.addChild(itemNode);

        item.betLog = betLog;
    }
}
