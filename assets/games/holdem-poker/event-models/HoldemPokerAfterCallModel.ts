import { EventEmitter } from "events";
import { HoldemPokerCardModel } from "./HoldemPokerCardModel";
import { HoldemPokerCombinationResult } from "./HoldemPokerCombinationResult";

export class HoldemPokerAfterCallModel extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
  }

  static Events = {
    CHANGE: "afterCall:change",
  };

  dealerCards: HoldemPokerCardModel[];
  communityCards: HoldemPokerCardModel[];
  combinationResult: HoldemPokerCombinationResult;
  totalAmount: number;

  changeDataAfterCall(
    dealerCards: HoldemPokerCardModel[],
    communityCards: HoldemPokerCardModel[],
    combinationResult: HoldemPokerCombinationResult,
    totalAmount: number
  ) {
    this.dealerCards = dealerCards;
    this.combinationResult = combinationResult;
    this.communityCards = communityCards;
    this.totalAmount = totalAmount;

    this.emit(HoldemPokerAfterCallModel.Events.CHANGE, this);
  }
}
