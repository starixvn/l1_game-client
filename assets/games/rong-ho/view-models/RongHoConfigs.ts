import { GameConfigBase } from "../../_base/view-models/GameConfigBase";

export class RongHoConfigs implements GameConfigBase {
    minBetTime: number;
    minBet: number;
    maxBet: number;
    fullTime = 36;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 5;
}
