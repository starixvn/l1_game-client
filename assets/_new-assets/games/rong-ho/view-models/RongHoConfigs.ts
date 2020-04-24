export interface GameConfigs {
    readonly betTime: number;
    readonly waitTime: number;
    readonly stopBetTime: number;
}

export class RongHoConfigs implements GameConfigs {
    betTime = 30;
    stopBetTime = 5;
    waitTime = 5;
}
