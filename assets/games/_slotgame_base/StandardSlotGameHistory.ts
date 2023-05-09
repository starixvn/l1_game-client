import SlotGameHistory from "./SlotGameHistory";
import StandardSlotGameTicketDetail from "./StandardSlotGameTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameHistory extends SlotGameHistory {
    gameId: number;
    mainAtlas: cc.SpriteAtlas;
    enableJackpot = false;

    initTicketDetail(): cc.Node {
        const node = super.initTicketDetail();
        const ticketDetail = node.getComponent(StandardSlotGameTicketDetail);
        ticketDetail.gameId = this.gameId;
        ticketDetail.enableJackpot = this.enableJackpot;
        return node;
    }
}
