import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import { numberPad } from "../../../common/helpers/NumberHelper";
import HiLo from "../view-models/HiLo";
import { HiLoResultModel } from "../events-models/HiLoResultModel";

export const updateClockTime =
    (clock: AnimatedTime) =>
    ({ globalRemaining }) => {
        console.log("remaining time", globalRemaining);
        if (!clock.node.active) {
            clock.node.active = true;
        }

        clock.setTime(numberPad(globalRemaining, 2));
        clock.setRedTime(10);
    };

export const resetCountdowmTimer = (mainGame: HiLo) => () => {
    mainGame.resetCountdownTimer();
};

export const updateCountdownTimer = (mainGame: HiLo) => (resultModel: HiLoResultModel) => {
    const durations = {
        lockingBet: 0,
        placingBet: 0,
        wholeRound: resultModel.remainingTime
    };
    mainGame.gameData.durations.initialize(durations);
};
