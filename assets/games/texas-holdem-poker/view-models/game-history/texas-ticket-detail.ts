import { TexasHoldemPokerTicketDetailModel } from "./../../event-models/texas-holdem-poker-ticket-detail-model";
import HoldemPokerTicketDetail from "../../../holdem-poker/view-models/history/HoldemPokerTicketDetail";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasTicketDetail extends HoldemPokerTicketDetail {
    renderBets(data: TexasHoldemPokerTicketDetailModel) {
        // super.renderBets(data);
        const { bets, isFold } = data.ticketDetail;
        this.heightBetTable = isFold ? 76 : 64;
        // bets.forEach((bet, index) => {
        //     this.heightBetTable += 60;
        //     this.handleTicketDetailItem(bet, index);
        // });
        this.betTable.node.height = this.heightBetTable;
    }

    renderCards(data: TexasHoldemPokerTicketDetailModel) {
        super.renderCards(data);
    }
}
