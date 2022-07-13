import { numberPad } from "../../../common/helpers/NumberHelper";
import GameDataManager from "../models/GameDataManager";
import MiniGameBase from "../view-models/MiniGameBase";

export const startGameLoop = (game: MiniGameBase) => () => {
    const gameLoop = () => game.gameData.durations.countdown();
    GameDataManager.getInstance().startGameLoop(game.gameId, gameLoop);
    if (game.gameData.durations.isWaiting()) {
        const settlement = game.gameData.roundHistory.roundHistory[0];
        if (settlement) {
            game.gameData.settlement.finishShowResult(settlement);
        } else {
            game.showWaittingTime(true);
        }
    }
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
