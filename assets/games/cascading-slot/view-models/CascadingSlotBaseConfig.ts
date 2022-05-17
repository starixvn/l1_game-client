export class CascadingSlotBaseConfig {
    normal: CascadingSlotConfigDuration = {
        highlightWinItemsDuration: 0.5,
        freeSpin: 4,
        bigWin: 4,
        bigWinFloatNumber: 3
    };

    turbo: CascadingSlotConfigDuration = {
        highlightWinItemsDuration: 0.3,
        freeSpin: 0.5,
        bigWin: 0.5,
        bigWinFloatNumber: 0.3
    };
}

export interface CascadingSlotConfigDuration {
    highlightWinItemsDuration: number;
    freeSpin: number;
    bigWin: number;
    bigWinFloatNumber: number;
}

export enum ConfigDurationEnum {
    highlightWinItemsDuration = "highlightWinItemsDuration"
}
