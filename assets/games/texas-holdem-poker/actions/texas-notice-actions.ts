import * as _ from "lodash";

import { TexasHoldemPokerState } from "../texas-type";
import { TexasHoldemPokerGameData } from "./../event-models/texas-holdem-poker-game-data";
import { TexasHoldemPokerChoicesType } from "../texas-type";

export const updateStatusGame = (gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>) => () => {
    if (gameData.stateModel.state === TexasHoldemPokerState.calling_call) {
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
