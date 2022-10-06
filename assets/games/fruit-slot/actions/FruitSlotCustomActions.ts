import GameBase from "../../_base/GameBase";
import FruitSlot from "../view-models/FruitSlot";

export const handleWaitingTime =
    (game: FruitSlot) =>
    ({ remaining }) => {
        console.log("handleWaitingTime");
        // game.timeAnimShowResult(remaining > game.config.betTime);
    };

export const updateOwnBets = (gameBase: GameBase) => (data) => {
    if (gameBase.isDisableGame) {
        return;
    }
    gameBase.betItems.forEach((item) => item.setOwnBetsData(data));
};
