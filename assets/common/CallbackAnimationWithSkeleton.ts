import CallbackAnimation from "./CallbackAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CallbackAnimationWithSkeleton extends CallbackAnimation {
    @property({ visible: false, override: true })
    animation: cc.Animation = null;

    @property(sp.Skeleton)
    effect: sp.Skeleton = null;

    protected duration: number;

    onLoad() {
        this.effect.setCompleteListener(() => this.finish());
    }

    setDuration(duration: number) {
        this.duration = duration;
    }

    updateDuration(duration: number) {
        const original = this.effect.findAnimation(this.effect.defaultAnimation).duration;
        this.effect.timeScale = original / duration;
    }

    play() {
        this.updateDuration(this.duration);
        this.effect.setAnimation(0, this.effect.animation, false);
    }
}
