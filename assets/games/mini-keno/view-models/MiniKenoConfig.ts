import { GameConfigBase } from "../../_base/view-models/GameConfigBase";
import { KenoType } from "./KenoUtils";

export default class MiniKenoConfig implements GameConfigBase {
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
