import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigWinAnimation extends cc.Component {
    @property(cc.Label)
    amountLabel: cc.Label = null;

    setAmount(amount: number, duration = 0, noZeroSuffix = false) {
        GameUtils.floatToNumber({ label: this.amountLabel, amount, duration, noZeroSuffix: noZeroSuffix });
    }

    async setAmountSlow(amount: number, onComplete: () => void) {
        await GameUtils.floatToNumber2({ label: this.amountLabel, amount });
        onComplete();
    }
}
