import * as i18n from "i18n/runtime-scripts/LanguageData";

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

    onLoad() {
        this.showMessageDisplay(RoundType.BEFORESPIN, false);
    }

    showMessageDisplay(roundType: RoundType, isTurboMode: boolean) {
        // if (!this.msgText) {
        //     return;
        // }
        const msgList = ["showMsgWhenSpin", "roundSettleMsg", "FromSettleToSpin"];
        let msg = `messages.roundSettleMsg`;
        if (roundType === RoundType.BEFORESPIN) {
            if (cc.sys.isMobile) {
                msg = `messages.${msgList[roundType] + "Phone"}`;
            } else {
                msg = `messages.${msgList[roundType] + "Desktop"}`;
            }
        }
        if (roundType === RoundType.SETTLED) {
            const items = isTurboMode ? [1, 2] : [1, 2, 3];
            const item = items[Math.floor(Math.random() * items.length)];
            msg = `messages.FromSettleToSpin${item}`;
        }
        if (roundType === RoundType.TUMBLEWIN) {
            msg = `messages.winTumbleMsg`;
        }
        this.msgText.string = GameUtils.capitalizeWordIntoString(`${i18n.t(msg)}`);
    }
}
