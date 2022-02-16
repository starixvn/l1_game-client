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

    change(higherAmount: number, lowerAmount: number, betWin: number) {
        this.higherAmount = higherAmount;
        this.betWin = betWin;
        this.lowerAmount = lowerAmount;

        this.emit(HiLoStakeModel.Events.CHANGE, this);
    }
}
