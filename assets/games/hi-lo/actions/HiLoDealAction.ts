import { HiLoStakeModel } from "../events-models/HiLoStakeModel";
import HiLoStakes from "../view-models/HiLoStakes";

export const updateHigherLowerStakes = (stakeComp: HiLoStakes) => (stakeModel: HiLoStakeModel) => {
    stakeComp.updateHigherLowerStakes(stakeModel);
};

export const updateAllStakes = (stakeComp: HiLoStakes) => (stakeModel: HiLoStakeModel) => {
    stakeComp.updateAllStakes(stakeModel);
};
