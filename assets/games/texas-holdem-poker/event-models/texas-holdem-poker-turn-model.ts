import { EventEmitter } from "events";

export class CardModel {
    rank: number;
    suit: number;

    constructor(rank: number, suit: number) {
        this.rank = rank;
        this.suit = suit;
    }
}

export class TexasHoldemPokerAfterTurnModel extends EventEmitter {
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
        this.emit(TexasHoldemPokerAfterTurnModel.Events.CHANGE, this);
    }
}
