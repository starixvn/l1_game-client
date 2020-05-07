export interface GameConfigs {
    readonly fullTime: number;
    readonly betTime: number;
    readonly waitTime: number;
    readonly nanTime: number;
    readonly redTime: number;
    readonly minBetTime: number;
}

export class ChanLeConfigs implements GameConfigs {
    fullTime: number = 66;
    betTime: number = 51;
    waitTime: number = 15;
    nanTime: number = 55;
    redTime: number = 5;
    minBetTime: number = 1;
}
