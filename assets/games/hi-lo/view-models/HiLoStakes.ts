import { numberTo, numberWithCommas } from "../../../common/helpers/NumberHelper";
import { HiLoStakeModel } from "../events-models/HiLoStakeModel";
const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoStakes extends cc.Component {
    @property(cc.Label)
    higherAmount: cc.Label = null;

    @property(cc.Label)
    betWin: cc.Label = null;

    @property(cc.Label)
    lowerAmount: cc.Label = null;

    updateStakes(data: HiLoStakeModel) {
        this.setAmount(this.higherAmount, numberWithCommas(data.higherAmount, 2), true);
        this.setAmount(this.lowerAmount, numberWithCommas(data.lowerAmount, 2), true);
        data.betWin && numberTo(this.betWin, data.betWin, 1, true);
    }

    setAmount(amountLabel: cc.Label, value: string, animated = false) {
        if (animated) {
            cc.tween(amountLabel.node)
                .to(0.3, { scale: 1.2 }, { easing: "linear" })
                .call(() => {
                    amountLabel.string = value;
                })
                .start();
        } else {
            amountLabel.string = value;
        }
    }

    resetStakes(betAmount: number) {
        this.setAmount(this.higherAmount, "");
        this.setAmount(this.lowerAmount, "");
        this.betWin.string = numberWithCommas(betAmount, 2);
    }
}
