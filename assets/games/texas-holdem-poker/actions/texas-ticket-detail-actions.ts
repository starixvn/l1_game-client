import TexasTicketDetailModel from "../event-models/texas-ticket-detail-model";
import TexasTicketHistory from "../view-models/game-history/texas-ticket-history";

export const renderTicketDetail = (ticketHistory: TexasTicketHistory) => (data: TexasTicketDetailModel) => {
    ticketHistory.showTicketDetail(data);
};
