import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import MiniGameBase from "../view-models/MiniGameBase";

export const handleNotice = (game: MiniGameBase) => (notice) => {
    const { errorCode, hedgeBetGroup, minBet, maxBet, gameRoundId, gameTypeId } = notice;
    const gameName = GameUtils.getGameNameString(gameTypeId);

    if (!gameRoundId || gameRoundId === game.roundId) {
        const opt = { gameName, gameRoundId, errorCode, minBet: numberWithCommas(minBet), maxBet: numberWithCommas(maxBet) };

        if (hedgeBetGroup && hedgeBetGroup.length > 0) {
            hedgeBetGroup.forEach((choice, index) => {
                opt[`betChoice${index + 1}`] = game.getBetChoiceString(choice);
            });
        }

        const text = NoticeUtil.getLocalizedErrorMessage(errorCode, opt);
        if (text) {
            game.showMiniWarning(text);
        }
    }
};

export const handleGameConfigs = (game: MiniGameBase) => (gameConfigs) => game.setGameConfigs(gameConfigs);

export const handleRoundHistory = (game: MiniGameBase) => (roundHistory) => {
    game.currentDataLogs = roundHistory;
    game.handleRoundHistory(roundHistory);
};

export const changeGameRound = (game: MiniGameBase) => (roundId) => game.setGameRound(roundId);
export const handleMD5Data = (game: MiniGameBase) => (data) => {
    game.md5Component && game.md5Component.handleMD5Data(data);
};

export const handleShowStatus = (game: MiniGameBase) => (status) => {
    game.showStatus(status);
    game.gameData.settlement.clearStatus();
};
export const handleShowResult = (game: MiniGameBase) => (settlement) => game.showSettlementResult(settlement);
export const handleAfterSettlementResult = (game: MiniGameBase) => (settlement) => {
    game.handleAfterSettlementResult(settlement);
    game.gameData.resultHash.updateUI();
    game.gameData.settlement.showStatus();
};
