import { miniSedieConfigs } from "../../games/muliplay-mini-sedie/scripts/MiniSedieConfigs";
import MiniGameRoundTimer from "./MiniGameRoundTimer";

const { ccclass } = cc._decorator;

@ccclass
export default class MiniSedieRoundTimer extends MiniGameRoundTimer {
    betOptions = ["odd", "even"];

    override initGameConfig() {
        this.gameConfig = miniSedieConfigs[this.gameId];
    }

    override setResult(settlement) {
        this.result.spriteFrame = settlement[this.betOptions[0]] ? this.resultSprites[0] : this.resultSprites[1];
    }
}
