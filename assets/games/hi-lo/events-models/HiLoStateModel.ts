import { EventEmitter } from "events";
import { HiLoState } from "./HiLoState";

export class HiLoStateModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
        this.state = HiLoState.start_round;
    }

    static Events = {
        CHANGE: "change",
        SETTLE: "settle"
    };

    state: number;

    startRound() {
        this.state = HiLoState.start_round;
        this.emit(HiLoStateModel.Events.CHANGE, this);
    }

    deal() {
        this.state = HiLoState.change_turn;
        this.emit(HiLoStateModel.Events.CHANGE, this);
    }

    collect() {
        this.state = HiLoState.settled;
        this.emit(HiLoStateModel.Events.CHANGE, this);
    }
}
