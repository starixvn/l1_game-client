import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import { numberPad } from "../../../common/helpers/NumberHelper";

export const updateClockTime =
    (clock: AnimatedTime) =>
    ({ globalRemaining }) => {
        if (!clock.node.active) {
            clock.node.active = true;
        }

        clock.setTime(numberPad(globalRemaining, 2));
        clock.setRedTime(10);
    };

export const hideClock = (clock: AnimatedTime) => () => {
    clock.node.active = false;
};
