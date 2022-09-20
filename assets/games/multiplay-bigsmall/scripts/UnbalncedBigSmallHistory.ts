import MultiplayGameHistory from "../../multiplay/scripts/MultiplayGameHistory";
import UnbalncedBigSmallHistoryItem from "./UnbalncedBigSmallHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalncedBigSmallHistory extends MultiplayGameHistory {
    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(UnbalncedBigSmallHistoryItem);
        item.setData(betLog, index);
        this.content.addChild(itemNode);
    }
}
