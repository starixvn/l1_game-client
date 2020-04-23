export interface GameConfigs {
    readonly fullTime: number;
    readonly betTime: number;
    readonly waitTime: number;
    readonly nanTime: number;
    readonly redTime: number;
    readonly minBetTime: number;
    readonly minBet: number;
    readonly maxBet: number;
}

export class ChanLeConfigs implements GameConfigs {
    fullTime: number = 66;
    betTime: number = 51;
    waitTime: number = 15;
    nanTime: number = 55;
    redTime: number = 5;
    minBetTime: number = 1;
    minBet: number = 1;
    maxBet: number = 500;
}
