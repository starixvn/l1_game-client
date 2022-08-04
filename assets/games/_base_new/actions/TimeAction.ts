import { numberPad } from "../../../common/helpers/NumberHelper";
import GameDataManager from "../models/GameDataManager";
import MiniGameBase from "../view-models/MiniGameBase";

export const startGameLoop = (game: MiniGameBase) => () => {
    const gameData = game.gameData;
    const gameLoop = () => gameData.durations.countdown();
    GameDataManager.getInstance().clearGameLoop(game.gameId);
    GameDataManager.getInstance().startGameLoop(game.gameId, gameLoop);
    if (gameData.durations.isWaiting() && !gameData.settlement.settlement) {
        const settlement = gameData.roundHistory.roundHistory[0];
        if (settlement) {
            gameData.settlement.finishShowResult(settlement, false);
        }
    }
};

export const stopGameLoop = (game: MiniGameBase) => () => {
    GameDataManager.getInstance().clearGameLoop(game.gameId);
};

export const updateTimeOut = (game: MiniGameBase) => () => {
    game.showMainTime(false);
    GameDataManager.getInstance().clearGameLoop(game.gameId);
};

export const updateClockTime =
    (game: MiniGameBase) =>
    ({ globalRemaining }) => {
        game.showWaittingTime(false);
        game.showMainTime(true);
        game.setMainTimeLabel(numberPad(globalRemaining, 2));
    };

export const updateLockBet =
    (game: MiniGameBase) =>
    ({ globalRemaining }) => {
        updateClockTime(game)({ globalRemaining });
        game.betItems.forEach((item: any) => item.resetHighlight());
    };

export const updatePlacingBet =
    (game: MiniGameBase) =>
    ({ globalRemaining }) => {
        updateClockTime(game)({ globalRemaining });
    };

export const updateWaiting =
    (game: MiniGameBase) =>
    ({ remaining }) => {
        game.showMainTime(false);
        game.showProcessingWarning(false);

        game.setWaitingTimeLabel(numberPad(remaining, 2));
    };

export const showCurrentRoundId = (game: MiniGameBase) => () => {
    game.gameData.roundHistory && game.gameData.changeRoundId(game.gameData.roundHistory.lastRoundId + 1);
};

export const showNextRoundId = (game: MiniGameBase) => () => {
    game.gameData.roundHistory && game.gameData.changeRoundId(game.gameData.roundHistory.lastRoundId);
};
