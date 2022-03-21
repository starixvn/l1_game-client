import { EventEmitter } from "events";
import { CardModel } from "../texas-type";

export default class TexasHoldModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "afterHold:change"
    };

    playerCards: CardModel[];
    combinationResult: any;
    roundId: number;

    changeDataAfterHold(playerCards: CardModel[], combinationResult: any, roundId: number) {
        this.playerCards = playerCards;
        this.roundId = roundId;
        this.combinationResult = combinationResult;
        this.emit(TexasHoldModel.Events.CHANGE, this);
    }
}
