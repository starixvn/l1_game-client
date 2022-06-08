import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigWinAnimation extends cc.Component {
    @property(cc.Label)
    amountLabel: cc.Label = null;

    setAmount(amount: number, duration = 0) {
        GameUtils.floatToNumber(this.amountLabel, amount, duration);
    }

    setAmountSlow(amount: number) {
        GameUtils.floatToNumber2(this.amountLabel, amount);
    }
}
