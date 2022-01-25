import { GameConfigBase } from "../../_base/view-models/GameConfigBase";
export default class HiLoConfigs implements GameConfigBase {
    minBetTime = 0;
    fullTime = 120;
    betTime = 120;
    stopBetTime = 0;
    waitTime = 0;
}
