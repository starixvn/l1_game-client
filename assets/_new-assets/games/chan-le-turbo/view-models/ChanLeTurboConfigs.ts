import { GameConfigs } from "../../chan-le/view-models/ChanLeConfigs";

export default class ChanLeTurboConfigs implements GameConfigs {
    fullTime: number = 36;
    betTime: number = 31;
    waitTime: number = 5;
    nanTime: number = 32;
    redTime: number = 5;
    minBetTime: number = 1;
    minBet: number = 1;
    maxBet: number = 500;
}