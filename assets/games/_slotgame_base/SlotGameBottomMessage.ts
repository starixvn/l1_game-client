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

    isTurboMode = false;
    isAutoSpin = false;
    autoSpinCount = 0;
    settleMsgIndex = 0;
    displayMessageTime = 3;
    normalSettledMsg = ["FromSettleToSpin1", "FromSettleToSpin2", "FromSettleToSpin3"];
    turboSettledMsg = ["FromSettleToSpin1", "FromSettleToSpin2"];
    settleTween: cc.Tween;

    onLoad() {
        this.updateBeforeSpinMessage();
    }

    updateAutoSpinCount(value: number) {
        this.autoSpinCount = value;
    }

    updateAutoSpinStatus(status: boolean) {
        this.isAutoSpin = status;
    }

    updateTurboModeStatus(status: boolean) {
        this.isTurboMode = status;
    }

    showOtherMessages(roundType: RoundType) {
        if (this.isAutoSpin) {
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
            case RoundType.TUMBLEWIN:
                msg = `messages.winTumbleMsg`;
                break;
        }
        this.msgText.string = GameUtils.capitalizeWordIntoString(GameUtils.getText(msg));
    }

    protected handleTurboAutoSpin() {
        const msg = `treasureIsland.autoSpinLeft`;
        this.msgText.string = GameUtils.capitalizeWordIntoString(`${i18n.t(msg)} ${this.autoSpinCount}`);
    }

    updateBeforeSpinMessage() {
        if (this.isAutoSpin) {
            this.handleTurboAutoSpin();
            return;
        }
        const deviceSuffix = cc.sys.isMobile ? "Phone" : "Desktop";
        this.msgText.string = GameUtils.capitalizeWordIntoString(GameUtils.getText(`messages.showMsgWhenSpin${deviceSuffix}`));
    }

    shuffleSettleMessage() {
        this.normalSettledMsg = _.shuffle(this.normalSettledMsg);
        this.turboSettledMsg = _.shuffle(this.turboSettledMsg);
    }

    reset() {
        this.settleTween && this.settleTween.stop();
        this.msgText.node.opacity = 255;
    }

    showSettledMessages() {
        if (this.isAutoSpin) {
            this.handleTurboAutoSpin();
            return;
        }

        this.settleMsgIndex++;
        const items = this.isTurboMode ? this.turboSettledMsg : this.normalSettledMsg;
        if (this.settleMsgIndex > items.length - 1) {
            this.settleMsgIndex = 0;
        }

        const msg = GameUtils.getText(`messages.${items[this.settleMsgIndex]}`);
        this.msgText.string = GameUtils.capitalizeWordIntoString(msg);

        this.settleTween = cc
            .tween(this.msgText.node)
            .to(0.3, { opacity: 255 }, { easing: "sineIn" })
            .delay(this.displayMessageTime)
            .call(() => {
                this.hideMessage();
            })
            .start();
    }

    hideMessage() {
        this.settleTween = cc
            .tween(this.msgText.node)
            .to(0.3, { opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                this.showSettledMessages();
            })
            .start();
    }
}
