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

    updateHigherLowerStakes(data: HiLoStakeModel) {
        this.higherAmount.string = numberWithCommas(data.higherAmount);
        this.lowerAmount.string = numberWithCommas(data.lowerAmount);
    }

    updateAllStakes(data: HiLoStakeModel) {
        this.updateHigherLowerStakes(data);
        this.setBetWin(data.betWin);
    }

    resetHigherLowerStakes() {
        this.higherAmount.string = "";
        this.lowerAmount.string = "";
    }

    setBetWin(amount: number) {
        this.betWin.string = numberWithCommas(amount);
    }
}
