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
        this.higherAmount.string = numberWithCommas(data.higherAmount);
        this.lowerAmount.string = numberWithCommas(data.lowerAmount);
        data.betWin && (this.betWin.string = numberWithCommas(data.betWin));
    }

    resetStakes(betAmount: number) {
        this.higherAmount.string = "";
        this.lowerAmount.string = "";
        this.betWin.string = numberWithCommas(betAmount);
    }
}
