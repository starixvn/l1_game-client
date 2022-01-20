import { EventEmitter } from "events";
import { HiLoCardModel } from "./HiLoCardModel";
import { HiLoStakeModel } from "./HiLoStakeModel";

export default class HiLoOwnBetModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "bet:change"
    };

    roundId: number;
    result: HiLoCardModel[];
    nextAmount: HiLoStakeModel;

    changeOwnBet(roundId: number, result: HiLoCardModel[], nextAmount: HiLoStakeModel) {
        this.result = result;
        this.nextAmount = nextAmount;
        this.roundId = roundId;

        this.emit(HiLoOwnBetModel.Events.CHANGE, this);
    }
}
