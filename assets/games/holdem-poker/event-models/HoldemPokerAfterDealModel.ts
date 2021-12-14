import { EventEmitter } from "events";

import { HoldemPokerCardModel } from "./HoldemPokerCardModel";
import { HoldemPokerCombinationResult } from "./HoldemPokerCombinationResult";

export class HoldemPokerAfterDealModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "afterDeal:change"
    };

    playerCards: HoldemPokerCardModel[];
    communityCards: HoldemPokerCardModel[];
    combinationResult: HoldemPokerCombinationResult;
    roundId: number;
    // totalAmount: number;

    changeDataAfterDeal(
        playerCards: HoldemPokerCardModel[],
        communityCards: HoldemPokerCardModel[],
        combinationResult: HoldemPokerCombinationResult,
        roundId: number,
        totalAmount: number
    ) {
        this.playerCards = playerCards;
        this.roundId = roundId;
        this.combinationResult = combinationResult;
        this.communityCards = communityCards;
        // this.totalAmount = totalAmount;

        this.emit(HoldemPokerAfterDealModel.Events.CHANGE, this);
    }
}
