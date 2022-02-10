import HiLoEventHandler from "./HiLoEventHandler";

export type TicketHistoryType<Choices> = {
    history: {};
};

export class HiLoTicketHistoryHandler<Choices> extends HiLoEventHandler<TicketHistoryType<Choices>, Choices> {
    protected verifyEvent(data: TicketHistoryType<Choices>) {
        return data.history != null;
    }

    protected handle(data: TicketHistoryType<Choices>) {
        this.gameData.ticketHistory.change(data.history);
    }
}
