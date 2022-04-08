import { TexasChoicesConst } from "./../texas-constants";
import { TexasState, TexasChoicesType } from "../texas-type";
import TexasGameDataModel from "./../event-models/texas-game-data-model";

export const updateStatusGame = (gameData: TexasGameDataModel<TexasChoicesType>) => () => {
    if (gameData.stateModel.state === TexasState.calling_call) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.holdSuccess();
    } else if (gameData.stateModel.state === TexasState.calling_turning || gameData.stateModel.state === TexasState.calling_check_turn) {
        gameData.placeBetModel.rejoinTable({
            anteBet: gameData.placeBetModel.choices[TexasChoicesConst.anteBet],
            callBet: gameData.placeBetModel.choices[TexasChoicesConst.callBet]
        });
        gameData.stateModel.callSuccess();
    } else if (gameData.stateModel.state === TexasState.calling_rivering || gameData.stateModel.state === TexasState.calling_check_river) {
        gameData.placeBetModel.rejoinTable({
            anteBet: gameData.placeBetModel.choices[TexasChoicesConst.anteBet],
            callBet: gameData.placeBetModel.choices[TexasChoicesConst.callBet],
            turnBet: gameData.placeBetModel.choices[TexasChoicesConst.callBet]
        });
        gameData.stateModel.turnSuccess();
    } else {
        gameData.stateModel.resetState();
        gameData.placeBetModel.resetBets();
    }
};
