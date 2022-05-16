import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { CascadingSlotConfigData } from "./../models/CascadingSlotConfigModel";

export const handleConfig = (mainGame: CascadingSlotBase) => async (data: CascadingSlotConfigData) => {
    mainGame.multiplierComponent.onSetData(
        {
            coinValues: data.coinValues,
            betLevels: data.betLevels,
            betMultiplier: data.betMultiplier
        },
        mainGame
    );
};
