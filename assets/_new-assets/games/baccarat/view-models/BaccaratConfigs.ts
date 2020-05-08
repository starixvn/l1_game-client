import { GameConfigs } from "../../_base/view-models/GameConfigs";

export class BaccaratConfigs implements GameConfigs {
    minBetTime: number = 0;
    minBet: number;
    maxBet: number;
    fullTime = 35;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 5;
}
