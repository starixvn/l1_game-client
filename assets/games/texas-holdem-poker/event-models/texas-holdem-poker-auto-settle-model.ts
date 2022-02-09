import { EventEmitter } from "events";

export class CardModel {
    rank: number;
    suit: number;

    constructor(rank: number, suit: number) {
        this.rank = rank;
        this.suit = suit;
    }
}

export class TexasHoldemPokerAutoSettleModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "afterRiver:change"
    };

    dealerCards: CardModel[];
    communityCards: CardModel[];
    combinationResult: any;
    roundId: number;
    totalAmount: number;
    step: string;

    updateModel(props: {
        dealerCards: CardModel[];
        communityCards: CardModel[];
        combinationResult: any;
        totalAmount: number;
        step: string;
    }) {
        const { dealerCards, communityCards, combinationResult, totalAmount, step } = props;
        this.dealerCards = dealerCards;
        this.combinationResult = combinationResult;
        this.communityCards = communityCards;
        this.totalAmount = totalAmount;
        this.step = step;
        this.emit(TexasHoldemPokerAutoSettleModel.Events.CHANGE, this);
    }
}
