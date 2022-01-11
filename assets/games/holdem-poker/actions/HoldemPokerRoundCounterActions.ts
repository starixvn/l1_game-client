import GameUtils from "../../../common/GameUtils";
import { HoldemPokerOwnBet } from "../event-models/HoldemPokerOwnBet";
import { HoldemPokerRoundCounter } from "../event-models/HoldemPokerRoundCounter";

export const updateRoundId = (gameRound: cc.Label) => (roundCounter: HoldemPokerRoundCounter) => {
    if (gameRound) {
        gameRound.string = `#${roundCounter.roundId}`;
        gameRound.node.position.x = GameUtils.isIpad() ? gameRound.node.position.x + 70 : gameRound.node.position.x;
    }
};

export const updateRoundCounter = (roundCounter: HoldemPokerRoundCounter) => (ownBets: HoldemPokerOwnBet) => {
    roundCounter.change(ownBets.roundId);
};
