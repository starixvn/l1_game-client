import SlotGameHistory from "../../_slotgame_base/SlotGameHistory";
import AHCLTicketDetail from "./AHCLTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AHCLHistory extends SlotGameHistory {
    showTicketDetail(data: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(AHCLTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        ticketDetailComponent.roundId.string = data.freeSpin ? `${data.id.toString()} (Free Spin)` : data.id.toString();
        ticketDetailComponent.initResultBoard(data.result);
        ticketDetailComponent.createBetLogs(data);
    }
}
