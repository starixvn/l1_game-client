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
    betAmount: number;

    change(win: boolean, betAmount: number) {
        this.win = win;
        this.betAmount = betAmount;

        this.emit(HiLoStatusModel.Events.CHANGE, this);
    }
}
