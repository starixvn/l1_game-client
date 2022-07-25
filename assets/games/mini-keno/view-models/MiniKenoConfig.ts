import { GameConfigBase } from "../../_base/view-models/GameConfigBase";
import { KenoType } from "./KenoUtils";

export default class MiniKenoConfig implements GameConfigBase {
    minBetTime = 1;
    fullTime = 55;
    betTime = 45;
    stopBetTime = 5;
    waitTime = 10;

    constructor(type: KenoType) {
        if (type === KenoType.East || type === KenoType.West || type === KenoType.North || type === KenoType.South || type === KenoType.Mega2) {
            this.fullTime = 40;
            this.betTime = 30;           
        }        

        if (type === KenoType.Mini) {
            this.fullTime = 47;
            this.betTime = 40;
            this.waitTime = 7;
        }

        if (type === KenoType.Mini2) {
            this.fullTime = 37;
            this.betTime = 30;
            this.waitTime = 7;
        }

    }
}
