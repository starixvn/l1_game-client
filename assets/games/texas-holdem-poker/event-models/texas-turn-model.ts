import { EventEmitter } from "events";
import { CardModel } from "../texas-type";

export default class TexasTurnModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "afterTurn:change"
    };

    communityCards: CardModel[];
    combinationResult: any;
    roundId: number;
    totalAmount: number;

    updateModel(communityCards: CardModel[], combinationResult: any, totalAmount: number) {
        this.combinationResult = combinationResult;
        this.communityCards = communityCards;
        this.totalAmount = totalAmount;
        this.emit(TexasTurnModel.Events.CHANGE, this);
    }
}
