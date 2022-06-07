import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigWinAnimation extends cc.Component {
    @property(cc.Label)
    amountLabel: cc.Label = null;

    setAmount(amount: number, duration = 0) {
        GameUtils.floatToNumber(this.amountLabel, amount, duration);
    }

    setAmountSlow(amount: number, turbo: boolean) {
        if (turbo) {
            GameUtils.floatToNumber2(this.amountLabel, amount, undefined, "", (value) => numberWithCommas(value, 2, false), {
                stepValue: 0.03,
                stepTime: 0.02
            });
        } else {
            GameUtils.floatToNumber2(this.amountLabel, amount);
        }
    }
}
