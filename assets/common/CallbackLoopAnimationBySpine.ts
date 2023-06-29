import CallbackLoopAnimation from "./CallbackLoopAnimation";
import GameUtils from "./GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CallbackLoopAnimationBySpine extends CallbackLoopAnimation {
    @property({ visible: false, override: true })
    loopClip: cc.AnimationClip = null;

    @property(sp.Skeleton)
    loopSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    coinLoopSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    effect: sp.Skeleton = null;

    protected duration: number;

    onLoad() {
        this.initHandleTouch();
        //this.effect.setCompleteListener(() => this.changeToLoopAnimation());
    }

    setDuration(duration: number) {
        this.duration = duration;
    }

    skipTouchToContinue() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
        this.effect.setCompleteListener(() => this.scheduleOnce(this.finish, this.delayFinishDuration));
    }

    updateDuration(duration: number) {
        GameUtils.updateSpineDuration(this.effect, this.effect.defaultAnimation, duration);
    }

    play() {
        this.duration && this.updateDuration(this.duration);
        this.effect.setAnimation(0, this.effect.animation, false);
    }
}
