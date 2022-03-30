import { TexasState, TexasChoicesType } from "../texas-type";
import TexasGameDataModel from "./../event-models/texas-game-data-model";

export const updateStatusGame = (gameData: TexasGameDataModel<TexasChoicesType>) => () => {
    if (gameData.stateModel.state === TexasState.calling_call) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.callSuccess();
    } else if (gameData.stateModel.state === TexasState.swapped || gameData.stateModel.state === TexasState.held) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.call();
    } else if (gameData.stateModel.state === TexasState.calling_turning) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.turnSuccess();
    } else if (gameData.stateModel.state === TexasState.calling_rivering) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.riveSuccess();
    } else {
        gameData.stateModel.resetState();
        gameData.placeBetModel.resetBets();
    }
};
