import { TexasHoldemPokerChoicesType } from "../texas-type";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import { TexasHoldemPokerOwnBetModel } from "../event-models/texas-holdem-poker-own-bet-model";
import { TexasHoldemPokerPlaceBetModel } from "../event-models/texas-holdem-poker-place-bet-model";

export const updatePreviousChoices = (placeBetModel: TexasHoldemPokerPlaceBetModel) => (bets: TexasHoldemPokerChoicesType) => {
    const anteBet = bets?.anteBet;

    placeBetModel.deal({ anteBet: anteBet });
};

export const showRejoinOwnBets =
    (gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>) => (ownBets: TexasHoldemPokerOwnBetModel) => {
        ownBets.bets && gameData.placeBetModel.rejoinTable(ownBets.bets);
    };
