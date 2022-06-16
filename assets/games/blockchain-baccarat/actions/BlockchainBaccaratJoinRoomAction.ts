import { showHighlightCards } from "./BlockchainBaccaratCardsActions";
import { showLabelWinning, showHighLightBet } from "./BlockchainBaccaratWinningAction";
import { BlockchainBaccaratRoundHistory } from "./../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const handleJoinRoom = (mainGame: BlockchainBaccarat) => (roundHistory: BlockchainBaccaratRoundHistory, currentIndex: number) => {
    // handle
    if (mainGame.timeHandler.isInWaitTime) {
        mainGame.cardsUI.showCardsWithoutAnimation(roundHistory, currentIndex, true);
        showLabelWinning(mainGame)(roundHistory.settlementResult, false);
        showHighLightBet(mainGame)(roundHistory.settlementResult, false);
        showHighlightCards(mainGame.cardsUI, roundHistory.settlementResult);
    }

    if (mainGame.timeHandler.isInRoundTime) {
        showHighLightBet(mainGame)(roundHistory.settlementResult, false);
    }
};
