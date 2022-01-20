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
    collectBetAmount: number;

    changeStatus(win: boolean, collectBetAmount: number) {
        this.win = win;
        this.collectBetAmount = collectBetAmount;

        this.emit(HiLoStatusModel.Events.CHANGE, this);
    }
}
