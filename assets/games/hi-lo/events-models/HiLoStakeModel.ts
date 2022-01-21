import { EventEmitter } from "events";
export class HiLoStakeModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "stake:change"
    };

    higherAmount: number;
    betWin: number;
    lowerAmount: number;

    change(higherAmount: number, betWin: number, lowerAmount: number) {
        this.higherAmount = higherAmount;
        this.betWin = higherAmount;
        this.lowerAmount = higherAmount;

        this.emit(HiLoStakeModel.Events.CHANGE, this);
    }
}
