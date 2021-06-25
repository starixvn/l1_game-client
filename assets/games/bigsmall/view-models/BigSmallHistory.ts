import LocalizedLabelWithFormat from "../../../common/i18n/LocalizedLabelWithFormat";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import BigSmallHistoryItem from "./BigSmallHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallHistory extends SocketIOGameHistoryBase {
    @property(LocalizedLabelWithFormat)
    gameName: LocalizedLabelWithFormat = null;

    onLoad() {
        super.onLoad();
    }

    setGameName(gameId: number) {
        this.gameName.dataId = `gameNames.${gameId}`;
    }

    public handleBetHistory = (roundId) => {};

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(BigSmallHistoryItem);
        item.setData(betLog, index);
        item.handleRoundIdClick = (roundId) => {
            this.openBetHistory(roundId);
        };
        this.content.addChild(itemNode);
    }

    openBetHistory(roundId: number) {
        this.handleBetHistory(roundId);
    }
}
