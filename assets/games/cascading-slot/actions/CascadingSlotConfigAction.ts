import { CalculateTotalBet } from "./../view-models/CascadingBetControl";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { CascadingSlotConfigData } from "./../models/CascadingSlotConfigModel";
import CascadingUIModel from "../models/CascadingUIModel";

export const handleBetControl = (mainGame: CascadingSlotBase) => async (data: CascadingSlotConfigData) => {
    mainGame.betControl.onSetData(
        {
            coinValues: data.coinValues,
            betLevels: data.betLevels,
            betMultiplier: data.betMultiplier
        },
        mainGame.gameData.placeBetModel,
        mainGame.gameData.uiModel
    );
};

export const handleTotalBet = (mainGame: CascadingSlotBase) => async (data: CascadingSlotConfigData) => {
    const totalBet = CalculateTotalBet(data.coinValues[0] ?? 0, data.betLevels[0] ?? 0, data?.betMultiplier ?? 0);
    mainGame.gameData.uiModel.emit(CascadingUIModel.Events.CHANGE_TOTAL_WIN, totalBet);
};
