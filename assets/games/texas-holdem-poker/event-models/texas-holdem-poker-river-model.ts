import { EventEmitter } from "events";

export class CardModel {
  rank: number;
  suit: number;

  constructor(rank: number, suit: number) {
    this.rank = rank;
    this.suit = suit;
  }
}

export class TexasHoldemPokerAfterRiverModel extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
  }

  static Events = {
    CHANGE: "afterRiver:change",
  };

  dealerCards: CardModel[];
  communityCards: CardModel[];
  combinationResult: any;
  roundId: number;
  totalAmount: number;

  updateModel(dealerCards: CardModel[], communityCards: CardModel[], combinationResult: any, totalAmount: number) {
    this.dealerCards = dealerCards;
    this.combinationResult = combinationResult;
    this.communityCards = communityCards;
    this.totalAmount = totalAmount;
    this.emit(TexasHoldemPokerAfterRiverModel.Events.CHANGE, this);
  }
}
