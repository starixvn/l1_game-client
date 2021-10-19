import { GameConfigBase } from "../../_base/view-models/GameConfigBase";

export class BitcoinMasterConfigs implements GameConfigBase {
    minBetTime = 1;
    fullTime = 120;
    betTime = 40;
    stopBetTime = 5;
    waitTime = 60;
}
