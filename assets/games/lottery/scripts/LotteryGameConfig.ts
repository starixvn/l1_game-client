import { GameConfigBase } from "../../_base/view-models/GameConfigBase";

export default class LotteryGameConfig implements GameConfigBase {
    minBetTime = 1;
    fullTime = 52;
    betTime = 45;
    stopBetTime = 5;
    waitTime = 7;
}
