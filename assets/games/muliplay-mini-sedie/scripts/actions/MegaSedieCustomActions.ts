import MiniSedie from "../MiniSedie";

export const handlePlacingBet = (game: MiniSedie) => () => {
    game.highlightLastResult();
    game.closePlate(false);
    game.checkCircleCountDown();
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
    };
