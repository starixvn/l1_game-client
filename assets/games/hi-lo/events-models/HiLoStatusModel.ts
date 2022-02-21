import { EventEmitter } from "events";

export class HiLoStatusModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "collect:change",
        COLLECT_FAILED: "collect:failed"
    };

    win: boolean;
    bet: number;

    change(win: boolean, bet: number) {
        this.win = win;
        this.bet = bet;

        this.emit(HiLoStatusModel.Events.CHANGE, this);
    }

    collectFailed() {
        this.emit(HiLoStatusModel.Events.COLLECT_FAILED);
    }
}
