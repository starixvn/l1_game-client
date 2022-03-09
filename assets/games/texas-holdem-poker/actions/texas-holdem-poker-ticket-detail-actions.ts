import TexasHoldemPokerTicketDetailModel from "../event-models/texas-holdem-poker-ticket-detail-model";
import TexasTicketHistory from "../view-models/game-history/texas-ticket-history";

export const renderTicketDetail = (ticketHistory: TexasTicketHistory) => (data: TexasHoldemPokerTicketDetailModel) => {
    ticketHistory.showTicketDetail(data);
};
