import { GameConfigs } from "../../_base/view-models/GameConfigs";

export class BaccaratConfigs implements GameConfigs {
    minBetTime: number = 0;
    minBet: number;
    maxBet: number;
    fullTime = 36;
    betTime = 33;
    stopBetTime = 5;
    waitTime = 3;
}
