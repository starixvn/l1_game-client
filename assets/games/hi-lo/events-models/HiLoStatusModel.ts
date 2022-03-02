import { EventEmitter } from "events";

export class HiLoStatusModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        WON: "collect:won",
        LOST: "collect:lost",
        COLLECT_FAILED: "collect:failed"
    };

    win: boolean;
    bet: number;

    isSettled = false;

    hasWon(win: boolean, bet: number) {
        this.win = win;
        this.bet = bet;
        this.isSettled = true;
        this.emit(HiLoStatusModel.Events.WON, this);
    }

    hasLost() {
        this.win = false;
        this.bet = 0;
        this.isSettled = true;
    }

    collectFailed() {
        this.emit(HiLoStatusModel.Events.COLLECT_FAILED);
    }

    reset() {
        this.isSettled = false;
    }
}
