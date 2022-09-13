import FruitSlot from "../view-models/FruitSlot";

export const handleWaitingTime =
    (game: FruitSlot) =>
    ({ remaining }) => {
        console.log("handleWaitingTime");
        game.timeAnimShowResult(remaining > game.config.betTime);
    };
