import * as _ from "lodash";

import { TexasState, TexasChoicesType } from "../texas-type";
import TexasGameDataModel from "./../event-models/texas-game-data-model";

export const updateStatusGame = (gameData: TexasGameDataModel<TexasChoicesType>) => () => {
    if (gameData.stateModel.state === TexasState.calling_call) {
        gameData.placeBetModel.rejoinTable(gameData.placeBetModel.previousChoices);
        gameData.stateModel.afterDeal();
    } else if (!_.isEmpty(gameData.placeBetModel.previousChoices)) {
        gameData.stateModel.afterCall();
        gameData.placeBetModel.resetBets();
    } else {
        gameData.stateModel.resetState();
        gameData.placeBetModel.resetBets();
    }
};
