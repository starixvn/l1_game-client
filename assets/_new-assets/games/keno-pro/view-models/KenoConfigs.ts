export interface GameConfigs {
    readonly fullTime: number;
    readonly betTime: number;
    readonly waitTime: number;
    readonly stopBetTime: number;
}

export class KenoConfigs implements GameConfigs {
    fullTime = 36;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 5;
}
