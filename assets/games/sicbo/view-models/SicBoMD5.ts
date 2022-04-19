import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import MD5Component from "../../_base/view-models/MD5Component";
import SicBo from "./SicBo";

const { ccclass } = cc._decorator;

@ccclass
export default class SicBoMD5 extends MD5Component {
    getDelayShowRawValue(mainGame: SicBo) {
        console.log(mainGame.currentTimeRemaining, "main.currentTimeRemaining");
        const finishHandler = mainGame.finishHandler as GameBaseFinishHandler;
        if (mainGame.currentTimeRemaining > mainGame.shakeThePlateTime && mainGame.currentTimeRemaining <= mainGame.config.fullTime - 3) {
            return 0;
        }
        return finishHandler.getResultAnimationTime();
    }
}
