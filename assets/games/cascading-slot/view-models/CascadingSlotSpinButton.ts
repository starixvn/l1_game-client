import SpinButton from "../../_slotgame_base/SpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotSpinButton extends SpinButton {
    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Node)
    autoSpinNode: cc.Node = null;

    override playAnimationSpin() {
        this.animation.defaultClip.speed = 1;
    }

    override playAnimationIdle() {
        this.animation.defaultClip.speed = 0.7;
    }

    override showAutoSpinMode() {
        this.autoSpinNode.active = true;
    }

    override showNormalMode() {
        this.autoSpinNode.active = false;
    }
}
