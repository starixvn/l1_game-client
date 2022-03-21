import { EventEmitter } from "events";
import { CardModel } from "../texas-type";

export default class TexasDealModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "afterDeal:change"
    };

    playerCards: CardModel[];
    communityCards: CardModel[];
    combinationResult: any;
    roundId: number;

    changeDataAfterDeal(playerCards: CardModel[], communityCards: CardModel[], combinationResult: any, roundId: number) {
        this.roundId = roundId;
        this.emit(TexasDealModel.Events.CHANGE, this);
    }
}
