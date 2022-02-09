import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import { TexasHoldemPokerOwnBetModel } from "../event-models/texas-holdem-poker-own-bet-model";
import { TexasHoldemPokerPlaceBetModel } from "../event-models/texas-holdem-poker-place-bet-model";

export const updatePreviousChoices = (placeBetModel: TexasHoldemPokerPlaceBetModel) => (bets: TexasHoldemPokerChoices) => {
    const anteBet = bets?.anteBet;

    placeBetModel.deal({ anteBet: anteBet });
};

export const showRejoinOwnBets =
    (gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices>) => (ownBets: TexasHoldemPokerOwnBetModel) => {
        ownBets.bets && gameData.placeBetModel.rejoinTable(ownBets.bets);
    };
