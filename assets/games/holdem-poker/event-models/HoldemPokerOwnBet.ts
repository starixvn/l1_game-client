import { EventEmitter } from "events";

import { HoldemPokerCardModel } from "./HoldemPokerCardModel";
import HoldemPokerChoices from "./HoldemPokerChoices";
import { HoldemPokerCombinationResult } from "./HoldemPokerCombinationResult";

export class HoldemPokerOwnBet extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        OWN_BETS: "ownBets",
        ROUNDID_CHANGE: "texasPokerRoundId"
    };

    roundId: number;
    bets: HoldemPokerChoices;
    playerCards: HoldemPokerCardModel[];
    communityCards: HoldemPokerCardModel[];
    combinationResult: HoldemPokerCombinationResult;
    totalAmount: number;

    changeOwnBets(props: {
        bets: any;
        playerCards: HoldemPokerCardModel[];
        communityCards: HoldemPokerCardModel[];
        combinationResult: any;
        roundId: number;
        totalAmount: number;
    }) {
        const { bets, playerCards, communityCards, combinationResult, roundId, totalAmount } = props;

        this.bets = bets;
        this.playerCards = playerCards;
        this.combinationResult = combinationResult;
        this.communityCards = communityCards;
        this.totalAmount = totalAmount;
        this.roundId = roundId;
        this.emit(HoldemPokerOwnBet.Events.OWN_BETS, this);
    }
}
