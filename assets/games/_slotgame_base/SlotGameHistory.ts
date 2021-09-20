import SocketIOGameHistoryBase from "../_base/view-models/SocketIOGameHistoryBase";
import SlotGameHistoryItem from "./SlotGameHistoryItem";
import SlotGameTicketDetail from "./SlotGameTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    showTicketDetail(data: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(SlotGameTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        ticketDetailComponent.setData(data);
    }

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(SlotGameHistoryItem);
        item.setData(betLog, index);
        item.showTicketDetail = (log) => {
            this.showTicketDetail(log);
        };
        this.content.addChild(itemNode);
    }
}
