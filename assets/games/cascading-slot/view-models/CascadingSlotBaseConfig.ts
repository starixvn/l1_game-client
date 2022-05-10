export class CascadingSlotBaseConfig {
    normal: CascadingSlotConfigDuration = {
        highlightWinItemsDuration: 0.5
    };

    turbo: CascadingSlotConfigDuration = {
        highlightWinItemsDuration: 0.3
    };
}

export interface CascadingSlotConfigDuration {
    highlightWinItemsDuration: number;
}
