import { EventEmitter } from "events";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import { HiLoStakeModel } from "./HiLoStakeModel";

export class HiLoResultModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "result:change"
    };

    result: CardModel[];
    nextAmount: HiLoStakeModel;
    remainingTime: number;

    change(result: CardModel[], nextAmount: HiLoStakeModel, remainingTime: number) {
        this.result = result;
        this.nextAmount = nextAmount;
        this.remainingTime = remainingTime;

        this.emit(HiLoResultModel.Events.CHANGE, this);
    }
}
