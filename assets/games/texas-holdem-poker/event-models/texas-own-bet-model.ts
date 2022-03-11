import { HoldemPokerOwnBet } from "../../holdem-poker/event-models/HoldemPokerOwnBet";

export default class TexasOwnBetModel extends HoldemPokerOwnBet {
    updateRoundId(roundId: number) {
        this.roundId = roundId;
        this.emit(TexasOwnBetModel.Events.ROUNDID_CHANGE, roundId);
    }
}
