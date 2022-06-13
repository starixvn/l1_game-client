import * as i18n from "i18n/runtime-scripts/LanguageData";
import _ = require("lodash");

import GameUtils from "../../common/GameUtils";

export enum RoundType {
    BEFORESPIN = 0,
    SPINNING = 1,
    SETTLED = 2,
    TUMBLEWIN = 3
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameBottomMessage extends cc.Component {
    @property(cc.Label)
    msgText: cc.Label = null;

    isTurboAutoSpin = false;
    autoSpinCount = 0;

    onLoad() {
        this.showMessageDisplay(RoundType.BEFORESPIN, false);
    }

    showMessageDisplay(roundType: RoundType, isTurboMode: boolean) {
        if (this.isTurboAutoSpin) {
            this.handleTurboAutoSpin();
            return;
        }
        let msg: string;
        switch (roundType) {
            case RoundType.SPINNING:
                msg = `messages.roundSettleMsg`;
                break;
            case RoundType.BEFORESPIN:
                const deviceSuffix = cc.sys.isMobile ? "Phone" : "Desktop";
                msg = `messages.showMsgWhenSpin${deviceSuffix}`;
                break;
            case RoundType.SETTLED:
                msg = this.getRandomMessageForSettled(isTurboMode);
                break;
            case RoundType.TUMBLEWIN:
                msg = `messages.winTumbleMsg`;
                break;

            default:
                break;
        }
        this.msgText.string = GameUtils.capitalizeWordIntoString(`${i18n.t(msg)}`);
    }

    protected handleTurboAutoSpin() {
        const leftAutoSpin = `treasureIsland.autoSpinLeft`;
        this.msgText.string = GameUtils.capitalizeWordIntoString(`${i18n.t(leftAutoSpin)} ${this.autoSpinCount}`);
    }

    protected getRandomMessageForSettled(isTurboMode: boolean) {
        const items = isTurboMode ? [1, 2] : [1, 2, 3];
        const item = items[_.random(items.length - 1)];
        return `messages.FromSettleToSpin${item}`;
    }
}
