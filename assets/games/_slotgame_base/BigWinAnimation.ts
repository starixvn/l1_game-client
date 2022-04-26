import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigWinAnimation extends cc.Component {
    @property(cc.Label)
    amountLabel: cc.Label = null;

    setAmount(amount: number, showBigWinValue: number) {
        GameUtils.floatToNumber(this.amountLabel, amount, showBigWinValue);
    }
}
