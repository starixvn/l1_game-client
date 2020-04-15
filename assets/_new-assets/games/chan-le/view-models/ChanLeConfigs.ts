export default class ChanLeConfigs {
    readonly fullTime: number;
    readonly betTime: number;
    readonly waitTime: number;
    readonly nanTime: number;
    readonly redTime: number;
    readonly minBetTime: number;
    readonly minBet: number;
    readonly maxBet: number;

    constructor() {
        this.fullTime = 66;
        this.betTime = 51;
        this.waitTime = 15;
        this.nanTime = 55;
        this.redTime = 5;
        this.minBetTime = 1;
        this.minBet = 1;
        this.maxBet = 500;
    }
}
