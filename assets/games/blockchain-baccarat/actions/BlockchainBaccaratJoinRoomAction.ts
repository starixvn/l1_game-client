import { Blockchain } from "./../event-models/BlockchainBaccaratCardListModel";
import { showHighlightCards } from "./BlockchainBaccaratCardsActions";
import { showLabelWinning, showHighLightBet } from "./BlockchainBaccaratWinningAction";
import { BlockchainBaccaratRoundHistory } from "./../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const handleJoinRoom =
    (mainGame: BlockchainBaccarat) => (roundHistory: BlockchainBaccaratRoundHistory[], currentIndex: number, blockchain: Blockchain) => {
        const lastRound = roundHistory[0];
        if (mainGame.timeHandler.isInWaitTime && !blockchain.isNew) {
            const playerCards = Object.values(lastRound.result.player).filter((card) => card != null);
            const bankerCards = Object.values(lastRound.result.banker).filter((card) => card != null);
            const cardsFlied = playerCards.length + bankerCards.length;

            mainGame.gameData.cardList.changeNumberCardsFly(cardsFlied);
            mainGame.cardsUI.showCardsWithoutAnimation(lastRound, currentIndex, true);
            showLabelWinning(mainGame)(lastRound.settlementResult, false);
            showHighLightBet(mainGame)(lastRound.settlementResult, false);
            showHighlightCards(mainGame.cardsUI, lastRound.settlementResult);
        }

        if (mainGame.timeHandler.isInRoundTime) {
            showHighLightBet(mainGame)(lastRound.settlementResult, false);
        }

        if (mainGame.timeHandler.isStartingNewGameRound || mainGame.timeHandler.isInWaitTime) {
            const playerCards = Object.values(lastRound.result.player).filter((card) => card != null);
            const bankerCards = Object.values(lastRound.result.banker).filter((card) => card != null);
            const prevRoundIndex = currentIndex - playerCards.length - bankerCards.length;
            mainGame.lastRoundIfo.updateUI(roundHistory[1], prevRoundIndex);
        } else {
            mainGame.lastRoundIfo.updateUI(lastRound, currentIndex);
        }

        mainGame.scoreboard.renderScoreBoardInGame(roundHistory);
    };
