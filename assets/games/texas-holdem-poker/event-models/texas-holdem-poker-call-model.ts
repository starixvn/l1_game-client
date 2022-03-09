import { EventEmitter } from "events";

import { HoldemPokerCardModel } from "../../holdem-poker/event-models/HoldemPokerCardModel";

export default class TexasHoldemPokerAfterCallModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "afterCall:change"
    };

    communityCards: HoldemPokerCardModel[];
    combinationResult: any;
    roundId: number;
    totalAmount: number;

    changeDataAfterCall(communityCards: HoldemPokerCardModel[], combinationResult: any, totalAmount: number) {
        this.combinationResult = combinationResult;
        this.communityCards = communityCards;
        this.totalAmount = totalAmount;
        this.emit(TexasHoldemPokerAfterCallModel.Events.CHANGE, this);
    }
}
