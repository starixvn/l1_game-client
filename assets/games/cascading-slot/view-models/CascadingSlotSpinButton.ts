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

    defaultClip: cc.AnimationClip;

    onLoad() {
        this.defaultClip = this.animation.defaultClip;
    }

    override playAnimationSpin() {
        this.animation.getAnimationState(this.animation.defaultClip.name).speed = 1.5;
        this.animation.play();
    }

    override playAnimationSpinTurbo() {
        this.animation.getAnimationState(this.animation.defaultClip.name).speed = 3;
        this.animation.play();
    }

    override playAnimationIdle() {
        this.animation.getAnimationState(this.animation.defaultClip.name).speed = 0.4;
        this.animation.play();
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
