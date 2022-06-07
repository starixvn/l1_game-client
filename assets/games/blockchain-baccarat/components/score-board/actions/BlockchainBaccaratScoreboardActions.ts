import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratScoreboard from "../view-models/BlockchainBaccaratScoreBoard";

export const renderScoreBoardInGame = (scoreboard: BlockchainBaccaratScoreboard) => (roundHistory: BlockchainBaccaratRoundHistory[]) => {
    scoreboard?.renderScoreBoardInGame(roundHistory);
};

export const renderScoreBoardEachRound = (scoreboard: BlockchainBaccaratScoreboard) => (settlementResult: any) => {
    scoreboard?.renderScoreBoardEachRound(settlementResult);
};
