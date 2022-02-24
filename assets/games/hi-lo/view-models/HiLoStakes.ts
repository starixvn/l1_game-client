import { numberWithCommas } from "../../../common/helpers/NumberHelper";
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
        this.setHigherAmount(numberWithCommas(data.higherAmount, 2));
        this.setLowerAmount(numberWithCommas(data.lowerAmount, 2));
        data.betWin && (this.betWin.string = numberWithCommas(data.betWin, 2));
    }

    setHigherAmount(value: string) {
        this.higherAmount.string = value;
    }

    setLowerAmount(value: string) {
        this.lowerAmount.string = value;
    }

    resetStakes(betAmount: number) {
        this.setHigherAmount("");
        this.setLowerAmount("");
        this.betWin.string = numberWithCommas(betAmount, 2);
    }
}
