import { HiLoStakeModel } from "../events-models/HiLoStakeModel";
import HiLoStakes from "../view-models/HiLoStakes";
import HiLo from "../view-models/HiLo";
import { HiLoTurnModel } from "../events-models/HiLoTurnModel";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";

export const updateHigherLowerStakes = (stakeComp: HiLoStakes) => (stakeModel: HiLoStakeModel) => {
    stakeComp.updateHigherLowerStakes(stakeModel);
};

export const updateAllStakes = (stakeComp: HiLoStakes) => (stakeModel: HiLoStakeModel) => {
    stakeComp.updateAllStakes(stakeModel);
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
