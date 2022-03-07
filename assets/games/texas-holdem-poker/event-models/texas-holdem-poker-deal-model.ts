import { EventEmitter } from "events";
import { CardModel } from "../texas-type";

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
