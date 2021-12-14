import { EventEmitter } from "events";

export class CardModel {
    rank: number;
    suit: number;

    constructor(rank: number, suit: number) {
        this.rank = rank;
        this.suit = suit;
    }
}

export class TexasHoldemPokerAfterDealModel extends EventEmitter {
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
        this.playerCards = playerCards;
        this.roundId = roundId;
        this.combinationResult = combinationResult;
        this.communityCards = communityCards || this.communityCards;
        this.emit(TexasHoldemPokerAfterDealModel.Events.CHANGE, this);
    }
}
