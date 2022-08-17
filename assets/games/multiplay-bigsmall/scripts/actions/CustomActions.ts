import UnbalancedBigSmall from "../UnbalancedBigSmall";

export const handlePlacingBet = (game: UnbalancedBigSmall) => () => {
    game.bgTimer.opacity = 255;
    game.highlightLastResult();
    game.resetThePlate();
    game.disableResultNode();
};

export const handleBeginPlacingBet = (game: UnbalancedBigSmall) => () => {
    cc.tween(game.bgTimer).to(0.3, { opacity: 255 }).start();
    game.gameData.resultHash.updateUI();
};

export const handleShakeDish = (game: UnbalancedBigSmall) => () => {
    game.resetDataAndUI();
    game.highlightLastResult();
    game.shakeThePlate();
};

export const handleSubGameWaitingTime =
    (game: UnbalancedBigSmall) =>
    ({ remaining }) => {
        game.timeAnimShowResult(remaining > game.config.betTime);
    };
