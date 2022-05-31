import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import CascadingSlotHistoryItem from "./CascadingSlotHistoryItem";
import CascadingSlotTicketDetail from "./CascadingSlotTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotGameHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    showTicketDetail(data: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(CascadingSlotTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        ticketDetailComponent.setData(data);
    }

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(CascadingSlotHistoryItem);
        item.setData(betLog, index);
        item.showTicketDetail = (log) => {
            this.showTicketDetail(log);
        };
        this.content.addChild(itemNode);
    }
}
