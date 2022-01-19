import { HoldemPokerTicketDetailModel } from "../event-models/HoldemPokerTicketDetailModel";
import HoldemPokerTicketHistory from "../view-models/history/HoldemPokerTicketHistory";

export const renderTicketDetail = (ticketHistory: HoldemPokerTicketHistory) => (data: HoldemPokerTicketDetailModel) => {
  ticketHistory.showTicketDetail(data);
};
