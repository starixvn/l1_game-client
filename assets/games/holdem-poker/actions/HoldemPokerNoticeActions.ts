import * as _ from "lodash";
import HoldemPokerChoices from "../event-models/HoldemPokerChoices";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import { HoldemPokerState } from "../event-models/HoldemPokerState";

export const updateStatusGame = (gameData: HoldemPokerGameData<HoldemPokerChoices>) => () => {
  if (gameData.stateModel.state === HoldemPokerState.calling_call) {
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
