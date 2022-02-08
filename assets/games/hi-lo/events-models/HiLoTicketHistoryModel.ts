import { EventEmitter } from "events";

export default class HiLoTicketHistoryModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "change"
    };

    data: any;

    change(data: any) {
        this.data = data;
        this.emit(HiLoTicketHistoryModel.Events.CHANGE, this);
    }
}
