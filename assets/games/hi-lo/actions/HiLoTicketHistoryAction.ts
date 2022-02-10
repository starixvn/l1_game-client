import HiLoTicketHistoryModel from "../events-models/HiLoTicketHistoryModel";
import HiLo from "../view-models/HiLo";

export const updateTicketHistory = (mainGame: HiLo) => (ticketHistory: HiLoTicketHistoryModel) => {
    mainGame.ticketHistoryComp.renderTicketHisroty(ticketHistory.data);
};
