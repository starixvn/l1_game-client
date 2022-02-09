import { EventEmitter } from "events";

export class HiLoStatusModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "collect:change"
    };

    win: boolean;
    bet: number;

    change(win: boolean, bet: number) {
        this.win = win;
        this.bet = bet;

        this.emit(HiLoStatusModel.Events.CHANGE, this);
    }
}
