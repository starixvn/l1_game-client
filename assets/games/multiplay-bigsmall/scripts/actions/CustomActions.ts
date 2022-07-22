import UnbalancedBigSmall from "../UnbalancedBigSmall";

export const handlePlacingBet = (game: UnbalancedBigSmall) => () => {
    game.bgTimer.opacity = 255;
    game.betItems.forEach((item) => item.resetHighlight());
    game.resetThePlate();
    game.disableResultNode();
};

export const showBgTimer = (game: UnbalancedBigSmall) => () => {
    cc.tween(game.bgTimer).to(0.3, { opacity: 255 }).start();
};

export const handleShakeDish =
    (game: UnbalancedBigSmall) =>
    ({ globalRemaining }) => {
        const shakeTimePoint = game.config.betTime + game.shakingDuration;
        if (globalRemaining === shakeTimePoint) {
            game.resetDataAndUI();
            game.shakeThePlate();
        }
    };
