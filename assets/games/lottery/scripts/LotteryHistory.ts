import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import LotteryHistoryItem from "./LotteryHistoryItem";
import LotteryTicketDetail from "./LotteryTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    bindItemRowData(betLog: any, index: any) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(LotteryHistoryItem);
        item.setData(betLog, index);
        item.showTicketDetail = (log) => {
            this.showTicketDetail(log);
        };
        this.content.addChild(itemNode);
    }

    showTicketDetail(data: any) {
        const node = cc.instantiate(this.ticketDetailPrefab);
        const detail = node.getComponent(LotteryTicketDetail);

        this.node.addChild(node);
        detail.setData(data);
    }

    onData(data) {
        super.onData(data);
        const { pageSize, total, betLogs } = data;

        if (betLogs && betLogs.length > 0) {
            const lastNode = this.content.children.slice(-1)[0];
            const item = lastNode.getComponent(LotteryHistoryItem);
            item.bottomLine.active = true;
        }

        if (total <= pageSize) {
            this.pagination.node.active = false;
        }
    }
}
