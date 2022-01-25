import { EventEmitter } from "events";
export class HiLoTurnModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "turn:change"
    };

    roundId: number;
    turnOrder: number;

    change(roundId: number, turnOrder: number) {
        this.roundId = roundId;
        this.turnOrder = turnOrder;

        this.emit(HiLoTurnModel.Events.CHANGE, this);
    }
}
