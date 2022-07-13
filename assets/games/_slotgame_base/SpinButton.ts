const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class SpinButton extends cc.Component {
    @property(cc.Button)
    spinButton: cc.Button = null;

    @property(cc.Label)
    autoSpinCountLabel: cc.Label = null;

    setAutoSpinCount(count: number) {
        this.autoSpinCountLabel.string = count.toString();
    }

    active() {
        this.spinButton.interactable = true;
    }

    deactive() {
        this.spinButton.interactable = false;
    }

    abstract playAnimationSpin();

    abstract playAnimationSpinTurbo();

    abstract playAnimationIdle();

    abstract showAutoSpinMode();

    abstract showNormalMode();
}
