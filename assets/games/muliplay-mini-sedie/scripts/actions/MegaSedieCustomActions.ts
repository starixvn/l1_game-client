import MiniSedie from "../MiniSedie";

export const handlePlacingBet =
    (game: MiniSedie) =>
    ({ globalRemaining }) => {
        game.highlightLastResult();
        game.closePlate(false);
        if (game.countDownProgressBar) {
            game.countDownProgressBar.indicatorSprite.node.scaleY = -1;
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

export const showResultWaitingIcon = (game: MiniSedie) => () => {
    game.timeAnimShowResult(true);
    game.countDownProgressBar && game.countDownProgressBar.setVisibilityIndicator(false);
};

export const updateLockingBetFrame =
    (game: MiniSedie) =>
    ({ globalRemaining }) => {
        if (game.countDownProgressBar) {
            game.countDownProgressBar.updateLockingBetFrame();
            game.countDownProgressBar.updateProgress(globalRemaining);
        }
    };

export const showRevertCountDown =
    (game: MiniSedie) =>
    ({ globalRemaining }) => {
        const condition =
            globalRemaining < game.config.fullTime - game.wholeResultTime &&
            game.countDownProgressBar &&
            !game.countDownProgressBar.isShowRevertCountDown;

        if (condition) {
            game.timeAnimShowResult(false);
            console.log("globalRemaining", globalRemaining);
            const duration = globalRemaining - game.config.betTime;
            game.countDownProgressBar.revertCountDown(duration);
        }
    };
