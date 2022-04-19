import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import MD5Component from "../../_base/view-models/MD5Component";
import SicBo from "./SicBo";

const { ccclass } = cc._decorator;

@ccclass
export default class SicBoMD5 extends MD5Component {
    getDelayShowRawValue(main: SicBo) {
        console.log(main.currentTimeRemaining, "main.currentTimeRemaining");
        const finishHandler = main.finishHandler as GameBaseFinishHandler;
        if (main.currentTimeRemaining > main.shakeThePlateTime && main.currentTimeRemaining <= main.config.fullTime - 3) {
            return 0;
        }
        return finishHandler.getResultAnimationTime();
    }
}
