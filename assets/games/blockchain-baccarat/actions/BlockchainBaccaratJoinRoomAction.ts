import { showHighlightCards } from "./BlockchainBaccaratCardsActions";
import { showLabelWinning, showHighLightBet } from "./BlockchainBaccaratWinningAction";
import { BlockchainBaccaratRoundHistory } from "./../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const handleJoinRoom = (mainGame: BlockchainBaccarat) => (roundHistory: BlockchainBaccaratRoundHistory[], currentIndex: number) => {
    const lastRound = roundHistory[0];
    if (mainGame.timeHandler.isInWaitTime) {
        mainGame.cardsUI.showCardsWithoutAnimation(lastRound, currentIndex, true);
        showLabelWinning(mainGame)(lastRound.settlementResult, false);
        showHighLightBet(mainGame)(lastRound.settlementResult, false);
        showHighlightCards(mainGame.cardsUI, lastRound.settlementResult);

        const playerCards = Object.values(lastRound.result.player).filter((card) => card != null);
        const bankerCards = Object.values(lastRound.result.banker).filter((card) => card != null);
        const prevRoundIndex = currentIndex - playerCards.length - bankerCards.length;
        mainGame.lastRoundIfo.updateUI(roundHistory[1], prevRoundIndex);
    }

    if (mainGame.timeHandler.isInRoundTime) {
        showHighLightBet(mainGame)(lastRound.settlementResult, false);
        mainGame.lastRoundIfo.updateUI(lastRound, currentIndex);
    }

    mainGame.scoreboard.renderScoreBoardInGame(roundHistory);
};
