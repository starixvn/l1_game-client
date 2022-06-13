import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratScoreboard from "../view-models/BlockchainBaccaratScoreBoard";

export const renderScoreBoardInGame = (scoreboard: BlockchainBaccaratScoreboard) => (roundHistory: BlockchainBaccaratRoundHistory[]) => {
    scoreboard?.renderScoreBoardInGame(roundHistory);
};

export const renderScoreBoardEachRound = (scoreboard: BlockchainBaccaratScoreboard) => (roundHistory: BlockchainBaccaratRoundHistory) => {
    scoreboard?.renderScoreBoardEachRound(roundHistory);
};

export const resetScoreBoard = (scoreboard: BlockchainBaccaratScoreboard) => () => {
    scoreboard.resetScoreboard();
};
