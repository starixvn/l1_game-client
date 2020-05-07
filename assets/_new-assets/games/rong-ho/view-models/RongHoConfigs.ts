import { GameBaseConfigs } from "../../_base/GameBaseConfig";

export class RongHoConfigs implements GameBaseConfigs {
    minBetTime: number;
    minBet: number;
    maxBet: number;
    fullTime = 36;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 5;
}
