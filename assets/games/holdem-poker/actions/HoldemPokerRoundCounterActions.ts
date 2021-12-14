import { HoldemPokerOwnBet } from "../event-models/HoldemPokerOwnBet";
import { HoldemPokerRoundCounter } from "../event-models/HoldemPokerRoundCounter";

export const updateRoundId = (gameRound: cc.Label) => (roundCounter: HoldemPokerRoundCounter) => {
  if (gameRound) {
    gameRound.string = `#${roundCounter.roundId}`;
  }
};

export const updateRoundCounter = (roundCounter: HoldemPokerRoundCounter) => (ownBets: HoldemPokerOwnBet) => {
  roundCounter.change(ownBets.roundId);
};
