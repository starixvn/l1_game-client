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
    isTrialMode = false;
    private normalSettledMsg = ["FromSettleToSpin1", "FromSettleToSpin2", "FromSettleToSpin3"];
    private turboSettledMsg = ["FromSettleToSpin1", "FromSettleToSpin2"];

    onLoad() {
        this.showMessages(RoundType.BEFORESPIN);
        this.shuffleSettleMessage();
    }

    shuffleSettleMessage() {
        this.normalSettledMsg = _.shuffle(this.normalSettledMsg);
        this.turboSettledMsg = _.shuffle(this.turboSettledMsg);
    }

    showMessages(roundType: RoundType) {
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
                msg = this.showBeforeSpinMessage();
                break;
            case RoundType.TUMBLEWIN:
                msg = `messages.winTumbleMsg`;
                break;
            case RoundType.SETTLED:
                msg = this.randomSettledMessages();
                break;
        }
        this.msgText.string = GameUtils.capitalizeWordIntoString(GameUtils.getText(msg));
    }

    protected handleTurboAutoSpin() {
        const msg = GameUtils.getText(`ui.autoSpinLeft`);
        this.msgText.string = GameUtils.capitalizeWordIntoString(`${msg} ${this.autoSpinCount}`);
    }

    protected showBeforeSpinMessage() {
        if (this.isTrialMode) {
            return GameUtils.getText(`messages.${this.turboSettledMsg[_.random(this.turboSettledMsg.length - 1)]}`);
        } else {
            const deviceSuffix = cc.sys.isMobile ? "Phone" : "Desktop";
            return GameUtils.capitalizeWordIntoString(GameUtils.getText(`messages.showMsgWhenSpin${deviceSuffix}`));
        }
    }

    protected randomSettledMessages() {
        const items = this.isTurboMode || this.isTrialMode ? this.turboSettledMsg : this.normalSettledMsg;
        return GameUtils.getText(`messages.${items[_.random(items.length - 1)]}`);
    }
}
