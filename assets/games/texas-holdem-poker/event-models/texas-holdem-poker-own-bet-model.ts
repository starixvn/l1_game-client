import { HoldemPokerOwnBet } from "../../holdem-poker/event-models/HoldemPokerOwnBet";

export class TexasHoldemPokerOwnBetModel extends HoldemPokerOwnBet {
    updateRoundId(roundId: number) {
        this.roundId = roundId;
        this.emit(TexasHoldemPokerOwnBetModel.Events.ROUNDID_CHANGE, roundId);
    }
}
