import FruitSlot from "./FruitSlot";
import FruitSlotAnimatedTimer from "./FruitSlotAnimatedTimer";

export const renderWaitingTimeClock = (clock: FruitSlotAnimatedTimer) => () => {
    clock.showHideCountdown(false);
    clock.showWaiting();
    clock.isShowWaiting = true;
};

// export const updateWaiting = (clock: FruitSlotAnimatedTimer) => () => {
//     console.log("updateWaiting");
//     renderWaitingTimeClock(clock);
// };

export const updateWaiting = (mainGame: FruitSlot) => () => {
    console.log("updateWaiting");
    const clock = mainGame.animatedTime;
    clock.showWaiting();
};
