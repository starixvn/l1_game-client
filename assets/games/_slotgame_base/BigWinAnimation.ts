import CallbackAnimation from "../../common/CallbackAnimation";
import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigWinAnimation extends CallbackAnimation {
    @property(cc.Label)
    amountLabel: cc.Label = null;

    private amount = 0;

    get textAnimationDuration() {
        return (this.animation.defaultClip.duration - 2) / this.animation.defaultClip.speed;
    }

    setAmount(amount: number) {
        this.amount = amount;
    }

    play() {
        this.animation.play();
        GameUtils.floatToNumber(this.amountLabel, this.amount, this.textAnimationDuration);
    }
}
