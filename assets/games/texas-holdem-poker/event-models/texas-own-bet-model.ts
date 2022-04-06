import { HoldemPokerOwnBet } from "../../holdem-poker/event-models/HoldemPokerOwnBet";
import { CardModel } from "../texas-type";

export default class TexasOwnBetModel extends HoldemPokerOwnBet {
    hasSwappedOrHold: boolean;

    updateRoundId(roundId: number) {
        this.roundId = roundId;
        this.emit(TexasOwnBetModel.Events.ROUNDID_CHANGE, roundId);
    }

    changeOwnBets(props: {
        bets: any;
        playerCards: CardModel[];
        communityCards: CardModel[];
        combinationResult: any;
        roundId: number;
        totalAmount: number;
        hasSwappedOrHold: boolean;
    }) {
        const { bets, playerCards, communityCards, combinationResult, roundId, totalAmount, hasSwappedOrHold } = props;

        this.bets = bets;
        this.playerCards = playerCards;
        this.combinationResult = combinationResult;
        this.communityCards = communityCards;
        this.totalAmount = totalAmount;
        this.roundId = roundId;
        this.hasSwappedOrHold = hasSwappedOrHold;
        this.emit(TexasOwnBetModel.Events.OWN_BETS, this);
    }

    receiveEmpty() {
        this.emit(TexasOwnBetModel.Events.EMPTY, this);
    }
}
