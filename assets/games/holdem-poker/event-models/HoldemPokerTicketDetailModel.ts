import { EventEmitter } from "events";

export class HoldemPokerTicketDetailModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "ticketDetail:change"
    };

    ticketDetail: any;

    changeTicketDetail(ticketDetail: any) {
        this.ticketDetail = ticketDetail;
        this.emit(HoldemPokerTicketDetailModel.Events.CHANGE, this);
    }
}
