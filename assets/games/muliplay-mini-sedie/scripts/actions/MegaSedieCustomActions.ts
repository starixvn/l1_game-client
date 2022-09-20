import MiniSedie from "../MiniSedie";

export const handlePlacingBet =
    (game: MiniSedie) =>
    ({ globalRemaining }) => {
        game.highlightLastResult();
        game.closePlate(false);
        if (game.countDownProgressBar) {
            game.countDownProgressBar.updateBetFrame();
            game.countDownProgressBar.updateProgress(globalRemaining);
        }
    };

export const handleShakeDish = (game: MiniSedie) => () => {
    game.gameAudios && game.gameAudios.playStartGameAudio();
    game.resetDataAndUI();
    game.highlightLastResult();
    game.shakeThePlate();
};

export const handleSubGameWaitingTime =
    (game: MiniSedie) =>
    ({ remaining }) => {
        game.timeAnimShowResult(remaining > game.config.betTime);
        game.countDownProgressBar && game.countDownProgressBar.setVisibilityProgressBar(!(remaining > game.config.betTime));
    };

export const updateLockingBetFrame =
    (game: MiniSedie) =>
    ({ globalRemaining }) => {
        if (game.countDownProgressBar) {
            game.countDownProgressBar.updateLockingBetFrame();
            game.countDownProgressBar.updateProgress(globalRemaining);
        }
    };

export const hideLockingBetSprite = (game: MiniSedie) => () => {
    game.countDownProgressBar && game.countDownProgressBar.setVisibilityProgressBar(false);
};
