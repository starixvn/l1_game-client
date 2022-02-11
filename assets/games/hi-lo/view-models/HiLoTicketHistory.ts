import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import HiLoTicketHistoryItem from "./HiLoTicketHistoryItem";
import { events } from "../../_new/connection/SocketIOConnection";
import BetHistory from "../../_new/common/BetHistory";
import HiLoTicketDetail from "./HiLoTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketHistory extends BetHistory {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Prefab)
    ticketHistoryItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    onLoad() {
        this.pages.init(this);
    }

    getHistory(page = 1) {
        this.connection.emit(events.getHistory, { page });
    }

    get_data(page = 1) {
        this.getHistory(page);
    }

    onData(data: any) {
        if (!data.history) {
            return;
        }

        this.pages.onSet(data.history.page, data.history.pageSize, data.history.total);
        this.content.children.forEach((child) => child.destroy());

        this.renderTicketHisroty(data.history);
    }

    renderTicketHisroty(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        //this.content.children.forEach((child) => child.destroy());
        data.betLogs.forEach((item) => {
            const itemNode = cc.instantiate(this.ticketHistoryItemPrefab);
            const control = itemNode.getComponent(HiLoTicketHistoryItem);
            control.renderTicketItem(item.time, item.id, item.amount, item.betwin);
            control.openTicketDetail = () => {
                this.initTicketDetail(item.betLogDetails);
            };
            this.content.addChild(itemNode);
        });
    }

    initTicketDetail(betLogDetails: []) {
        const ticketDetailNode = cc.instantiate(this.ticketDetailPrefab);
        this.node.addChild(ticketDetailNode);
        const detailControl = ticketDetailNode.getComponent(HiLoTicketDetail);
        detailControl.setData(betLogDetails);
    }
}
