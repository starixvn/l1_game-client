import MultiplayGameHistory from "../../multiplay/scripts/MultiplayGameHistory";
import MultiplaySedieHistoryItem from "./MiniSedieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieHistory extends MultiplayGameHistory {
    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(MultiplaySedieHistoryItem);
        item.background.active = index % 2 === 1;
        item.setData(betLog);
        this.content.addChild(itemNode);
    }
}
