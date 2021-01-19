import { GameBaseConfigs } from "../../_base/GameBaseConfig";
import { KenoType } from "./KenoUtils";

export default class MiniKenoConfig implements GameBaseConfigs {
    minBetTime = 1;
    fullTime = 59;
    betTime = 50;
    stopBetTime = 5;
    waitTime = 10;

    constructor(type: KenoType) {
        if (type === KenoType.East || type === KenoType.West || type === KenoType.North || type === KenoType.South) {
            this.fullTime = 39;
            this.betTime = 30;
        }
    }
}
