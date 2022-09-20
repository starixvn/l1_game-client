import MultiplayGameHistory from "../../multiplay/scripts/MultiplayGameHistory";
import MultiplaySedieHistoryItem from "./MiniSedieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieHistory extends MultiplayGameHistory {
    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(MultiplaySedieHistoryItem);
        item.setData(betLog, index);
        this.content.addChild(itemNode);
    }
}
