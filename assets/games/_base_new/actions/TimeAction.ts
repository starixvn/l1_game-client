import { numberPad } from "../../../common/helpers/NumberHelper";
import GameDataManager from "../models/GameDataManager";
import MiniGameBase from "../view-models/MiniGameBase";

export const startGameLoop = (gameBase: MiniGameBase) => () => {
    const gameLoop = () => gameBase.gameData.durations.countdown();
    GameDataManager.getInstance().startGameLoop(gameBase.gameId, gameLoop);
};

export const updateClockTime =
    (mainGame: MiniGameBase) =>
    ({ globalRemaining }) => {
        mainGame.showWaittingTime(false);
        mainGame.showMainTime(true);
        mainGame.setMainTimeLabel(numberPad(globalRemaining, 2));
    };

export const updateLockBet =
    (mainGame: MiniGameBase) =>
    ({ globalRemaining }) => {
        updateClockTime(mainGame)({ globalRemaining });
        mainGame.betItems.forEach((item: any) => item.resetHighlight());
    };

export const updatePlacingBet =
    (mainGame: MiniGameBase) =>
    ({ globalRemaining }) => {
        updateClockTime(mainGame)({ globalRemaining });
    };

export const updateWaiting =
    (mainGame: MiniGameBase) =>
    ({ remaining }) => {
        mainGame.showMainTime(false);
        mainGame.showProcessingWarning(false);

        mainGame.showWaittingTime(true);
        mainGame.setWaitingTimeLabel(numberPad(remaining, 2));
    };
