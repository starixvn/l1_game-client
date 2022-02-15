import { TexasHoldemPokerState } from './../event-models/texas-holdem-poker-constant';
import { TexasHoldemPokerGameData } from "./../event-models/texas-holdem-poker-game-data";
import * as _ from "lodash";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";

export const updateStatusGame = (gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices>) => () => {
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
