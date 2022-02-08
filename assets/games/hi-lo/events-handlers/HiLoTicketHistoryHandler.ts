import HiLoEventHandler from "./HiLoEventHandler";

export type TicketHistoryType<Choices> = {
    history: {
        betLogs: [];
        page: number;
        pageSize: number;
        total: number;
    };
};

export class HiLoTicketHistoryHandler<Choices> extends HiLoEventHandler<ConfigsType<Choices>, Choices> {
    protected verifyEvent(data: TicketHistoryType<Choices>) {
        return data.history != null;
    }

    protected handle(data: TicketHistoryType<Choices>) {
        this.gameData.ticketHistory.change(data.history.betLogs);
    }
}
