import { GameConfigBase } from "../../_base/view-models/GameConfigBase";

export class BlockchainBaccaratConfig implements GameConfigBase {
    minBetTime = 1;
    fullTime = 45;
    fullTimeNewShoe = 55;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 20;
}
