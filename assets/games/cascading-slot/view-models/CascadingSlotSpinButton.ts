import SpinButton from "../../_slotgame_base/SpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotSpinButton extends SpinButton {
    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Node)
    autoSpinNode: cc.Node = null;

    @property(cc.Node)
    spinTextNode: cc.Node = null;

    @property(cc.Node)
    disable: cc.Node = null;

    override playAnimationSpin() {
        this.animation.defaultClip.speed = 1;
    }

    override playAnimationIdle() {
        this.animation.defaultClip.speed = 0.7;
    }

    override showAutoSpinMode() {
        this.autoSpinNode.active = true;
        this.spinButton.interactable = false;
        this.spinTextNode.active = false;
    }

    override showNormalMode() {
        this.autoSpinNode.active = false;
        this.spinButton.interactable = true;
        this.spinTextNode.active = true;
    }
}
