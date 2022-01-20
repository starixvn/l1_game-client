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

    changeResult(result: HiLoCardModel[], nextAmount: HiLoStakeModel, remainingTime: number) {
        this.result = result;
        this.nextAmount = nextAmount;
        this.remainingTime = remainingTime;

        this.emit(HiLoResultModel.Events.CHANGE);
    }
}
