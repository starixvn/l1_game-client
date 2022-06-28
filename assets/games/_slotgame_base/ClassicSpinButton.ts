import SpinButton from "./SpinButton";

const { ccclass, property } = cc._decorator;

enum SpinAnimationType {
    IDLE = 0,
    SPIN
}
@ccclass
export default class ClassicSpinButton extends SpinButton {
    @property(cc.Node)
    normalSpinNode: cc.Node = null;

    @property(cc.Label)
    freeSpinLabel: cc.Label = null;

    @property(cc.Node)
    textSpinInFreeSpin: cc.Node = null;

    @property(cc.Animation)
    spinAnimation: cc.Animation = null;

    @property(cc.ParticleSystem)
    spinParticle: cc.ParticleSystem = null;

    hideAll() {
        this.normalSpinNode.active = false;
        this.freeSpinLabel.node.parent.active = false;
        this.autoSpinCountLabel.node.parent.active = false;
    }

    showFreeSpinMode() {
        this.hideAll();
        this.freeSpinLabel.node.parent.active = true;
    }

    override showAutoSpinMode() {
        this.hideAll();
        this.autoSpinCountLabel.node.parent.active = true;
    }

    override showNormalMode() {
        this.hideAll();
        this.normalSpinNode.active = true;
    }

    setFreeSpinValue(value: number) {
        this.freeSpinLabel.string = value.toString();
    }

    showTextSpinInFreeSpin(show: boolean) {
        this.textSpinInFreeSpin.active = show;
    }

    protected playAnimation(index: number) {
        if (!this.spinAnimation) {
            return;
        }
        const clips = this.spinAnimation.getClips();
        if (clips.length === 0 || index >= clips.length) {
            return;
        }
        this.spinAnimation.play(clips[index].name);
    }

    protected playParticleSpin() {
        this.spinParticle && this.spinParticle.resetSystem();
    }

    override playAnimationSpin() {
        this.playParticleSpin();
        this.playAnimation(SpinAnimationType.SPIN);
    }

    override playAnimationIdle() {
        this.playAnimation(SpinAnimationType.IDLE);
    }
}
