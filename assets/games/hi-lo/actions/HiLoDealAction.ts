import HiLoStakes from "../view-models/HiLoStakes";
import HiLo from "../view-models/HiLo";
import { HiLoTurnModel } from "../events-models/HiLoTurnModel";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLoOwnBetModel from "../events-models/HiLoOwnBetModel";
import HiLoResult from "../view-models/HiLoResult";
import { HiLoResultModel } from "../events-models/HiLoResultModel";

export const updateHigherLowerStakes = (stakeComp: HiLoStakes) => (ownBetModel: HiLoOwnBetModel) => {
    stakeComp.updateHigherLowerStakes(ownBetModel.nextAmount);
};

export const updateAllStakes = (stakeComp: HiLoStakes) => (resultModel: HiLoResultModel) => {
    stakeComp.updateAllStakes(resultModel.nextAmount);
};

export const checkUserLose = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    if (!statusModel.win) {
        mainGame.showUserLoseMessage(true);
        mainGame.turnOrder = 0;
    }
};

export const updateTurnOrder = (mainGame: HiLo) => (turnModel: HiLoTurnModel) => {
    mainGame.turnOrder = turnModel.turnOrder;
};

export const updateCard = (resultComp: HiLoResult) => (ownBetModel: HiLoOwnBetModel) => {
    if (ownBetModel.result.length > 0) {
        resultComp.setResult(ownBetModel.result[ownBetModel.result.length - 1]);
    }
};
