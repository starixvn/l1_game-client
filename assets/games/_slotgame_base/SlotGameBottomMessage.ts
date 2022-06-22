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
    private normalSettledMsg = ["FromSettleToSpin1", "FromSettleToSpin2", "FromSettleToSpin3"];
    private turboSettledMsg = ["FromSettleToSpin1", "FromSettleToSpin2"];

    onLoad() {
        this.showBeforeSpinMessage();
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
                const deviceSuffix = cc.sys.isMobile ? "Phone" : "Desktop";
                msg = `messages.showMsgWhenSpin${deviceSuffix}`;
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
        const msg = GameUtils.getText(`treasureIsland.autoSpinLeft`);
        this.msgText.string = GameUtils.capitalizeWordIntoString(`${msg} ${this.autoSpinCount}`);
    }

    protected showBeforeSpinMessage() {
        const deviceSuffix = cc.sys.isMobile ? "Phone" : "Desktop";
        this.msgText.string = GameUtils.capitalizeWordIntoString(GameUtils.getText(`messages.showMsgWhenSpin${deviceSuffix}`));
    }

    protected randomSettledMessages() {
        const items = this.isTurboMode ? this.turboSettledMsg : this.normalSettledMsg;
        return GameUtils.getText(`messages.${items[_.random(items.length - 1)]}`);
    }
}
