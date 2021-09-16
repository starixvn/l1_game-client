const { ccclass, property } = cc._decorator;

@ccclass
export default class SpinButton extends cc.Component {
    @property(cc.Button)
    spinButton: cc.Button = null;

    @property(cc.Node)
    normalSpinNode: cc.Node = null;

    @property(cc.Label)
    freeSpinLabel: cc.Label = null;

    @property(cc.Label)
    autoSpinCountLabel: cc.Label = null;

    @property(cc.Node)
    textSpinInFreeSpin: cc.Node = null;

    @property(cc.Animation)
    spinAnimation: cc.Animation = null;

    @property(cc.ParticleSystem)
    spinParticle: cc.ParticleSystem = null;

    active() {
        this.spinButton.interactable = true;
    }

    deactive() {
        this.spinButton.interactable = false;
    }

    hideAll() {
        this.normalSpinNode.active = false;
        this.freeSpinLabel.node.parent.active = false;
        this.autoSpinCountLabel.node.parent.active = false;
    }

    showFreeSpinMode() {
        this.hideAll();
        this.freeSpinLabel.node.parent.active = true;
    }

    showAutoSpinMode() {
        this.hideAll();
        this.autoSpinCountLabel.node.parent.active = true;
    }

    showNormalMode() {
        this.hideAll();
        this.normalSpinNode.active = true;
    }

    setAutoSpinCount(count: number) {
        this.autoSpinCountLabel.string = count.toString();
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

    playParticleSpin() {
        if (this.spinParticle) {
            this.spinParticle.resetSystem();
        }
    }

    playAnimationSpin() {
        this.playParticleSpin();
        this.playAnimation(1);
    }

    playAnimationIdle() {
        this.playAnimation(0);
    }
}
