import CallbackAnimation from "../../../common/CallbackAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClubCallbackAnimation extends CallbackAnimation {
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
