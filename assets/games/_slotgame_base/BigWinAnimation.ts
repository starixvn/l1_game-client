import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigWinAnimation extends cc.Component {
    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property
    delayShowMoney = 2;

    @property
    durationShowTotal = 0;

    amount = 0;

    // get textAnimationDuration() {
    //     return (this.animation.defaultClip.duration - this.delayShowMoney - this.durationShowTotal) / this.animation.defaultClip.speed;
    // }

    setAmount(amount: number, showBigWinValue: number) {
        this.amount = amount;
        GameUtils.floatToNumber(this.amountLabel, this.amount, showBigWinValue);
    }

    // play() {
    //     this.animation.play();

    // }
}
