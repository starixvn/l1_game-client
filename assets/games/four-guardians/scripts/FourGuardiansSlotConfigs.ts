import { SlotGameBaseConfigs } from "../../_slotgame_base/SlotGameBaseConfigs";

export class FourGuardiansSlotConfigs implements SlotGameBaseConfigs {
    wildSymbol = 9;
    jackpotSymbol = 10;
    showTotalBonusAmountDuration = 3;
    bonusTimeOut = 120;

    normalMode = {
        spinDuration: 1.25,
        winningDuration: 1.5,
        noWinningDuration: 1,
        bigWinDuration: 3.5,
        freespinDuration: 3.5,
        bonusDuration: 4.61,
        jackpotDuration: 4.61
    };

    turboMode = {
        spinDuration: 0.5,
        winningDuration: 1,
        noWinningDuration: 0.75,
        bigWinDuration: 2,
        freespinDuration: 2,
        bonusDuration: 4.61,
        jackpotDuration: 4.61
    };
}
