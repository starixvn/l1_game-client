import ClassicSpinButton from "../../_slotgame_base/ClassicSpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FortuneCatSpinButton extends ClassicSpinButton {
    @property({ visible: false, override: true })
    autoSpinCountLabel: cc.Label = null;

    onLoad() {
        this.hideAutoSpin();
    }

    override playAnimationSpin() {}

    override playAnimationIdle() {}
}
