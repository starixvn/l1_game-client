import { EventEmitter } from "events";
import { HiLoCardModel } from "./HiLoCardModel";
import { HiLoStakeModel } from "./HiLoStakeModel";

export class HiLoResultModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "result:change"
    };

    result: HiLoCardModel[];
    nextAmount: HiLoStakeModel;
    remainingTime: number;
    betWin: number;

    changeResult(result: HiLoCardModel[], nextAmount: HiLoStakeModel, remainingTime: number, betWin: number) {
        this.result = result;
        this.nextAmount = nextAmount;
        this.remainingTime = remainingTime;
        this.betWin = betWin;

        this.emit(HiLoResultModel.Events.CHANGE);
    }
}
