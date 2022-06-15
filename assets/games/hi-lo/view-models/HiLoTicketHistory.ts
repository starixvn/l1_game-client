import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import HiLoTicketHistoryItem from "./HiLoTicketHistoryItem";
import BetHistory from "../../_new/common/BetHistory";
import HiLoTicketDetail from "./HiLoTicketDetail";
import { BetLog, TicketHistoryData } from "./HiLoBetData";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketHistory extends BetHistory {
    @property(cc.Prefab)
    ticketHistoryItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    baseRoundItemPrefab: cc.Prefab = null;

    renderTicketHistory(data: TicketHistoryData) {
        data.betLogs.forEach((item) => {
            const itemNode = GameUtils.createNodeFromPrefab(this.ticketHistoryItemPrefab);
            const control = itemNode.getComponent(HiLoTicketHistoryItem);
            control.renderTicketItem(item);
            control.openTicketDetail = () => {
                this.initTicketDetail(item);
            };
            this.content.addChild(itemNode);
        });
    }

    initTicketDetail(data: BetLog) {
        const ticketDetailNode = GameUtils.createNodeFromPrefab(this.ticketDetailPrefab);
        this.node.addChild(ticketDetailNode);
        const detailControl = ticketDetailNode.getComponent(HiLoTicketDetail);
        detailControl.renderTicketDetail(data);
    }
}
