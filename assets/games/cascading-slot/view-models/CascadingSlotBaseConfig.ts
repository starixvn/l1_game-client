export class CascadingSlotBaseConfig {
    normal: CascadingSlotConfigDuration = {
        highlightWinItemsDuration: 0.5,
        freeSpin: 3,
        bigWin: 1,
        bigWinFloatNumber: 3,
        delayForNextSpin: 0.3
    };

    turbo: CascadingSlotConfigDuration = {
        highlightWinItemsDuration: 0.3,
        freeSpin: 3,
        bigWin: 0.5,
        bigWinFloatNumber: 0.3,
        delayForNextSpin: 0.1
    };
}

export interface CascadingSlotConfigDuration {
    highlightWinItemsDuration: number;
    freeSpin: number;
    bigWin: number;
    bigWinFloatNumber: number;
    delayForNextSpin: number;
}

export enum ConfigDurationEnum {
    highlightWinItemsDuration = "highlightWinItemsDuration"
}
