import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";
import SicBo from "./SicBo";

const { ccclass } = cc._decorator;

@ccclass
export default class SicBoMD5 extends MD5Component {
    getDelayShowRawValue(mainGame: SicBo) {
        const finishHandler = mainGame.finishHandler as GameBaseFinishHandler;
        if (mainGame.currentTimeRemaining > mainGame.shakeThePlateTime + 3) {
            return 0;
        }
        return finishHandler.getResultAnimationTime();
    }

    handleTooltip(data: MD5Type) {
        this.md5Tooltip.hideToolTip();
    }

    generateMD5Result(data: MD5Type) {
        const value = data.hashValue || data.rawValue;
        this.md5Value.string = `${value}`;
    }
}
