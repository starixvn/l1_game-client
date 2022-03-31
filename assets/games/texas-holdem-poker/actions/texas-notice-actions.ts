import { TexasState, TexasChoicesType, TexasStateString } from "../texas-type";
import TexasGameDataModel from "./../event-models/texas-game-data-model";

export const updateStatusGame = (gameData: TexasGameDataModel<TexasChoicesType>) => () => {
    console.log(TexasStateString[gameData.stateModel.state], "gameData.stateModel.state");
    if (gameData.stateModel.state === TexasState.calling_call) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.holdSuccess();
    } else if (gameData.stateModel.state === TexasState.calling_turning || gameData.stateModel.state === TexasState.calling_check_turn) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.callSuccess();
    } else if (gameData.stateModel.state === TexasState.calling_rivering || gameData.stateModel.state === TexasState.calling_check_river) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.turnSuccess();
    } else {
        gameData.stateModel.resetState();
        gameData.placeBetModel.resetBets();
    }
};
