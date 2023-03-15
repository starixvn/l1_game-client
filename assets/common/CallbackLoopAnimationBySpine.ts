import CallbackLoopAnimation from "./CallbackLoopAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CallbackLoopAnimationBySpine extends CallbackLoopAnimation {
    @property({ visible: false, override: true })
    loopClip: cc.AnimationClip = null;

    @property(sp.SkeletonData)
    loopSpine: sp.SkeletonData = null;

    @property(sp.Skeleton)
    effect: sp.Skeleton = null;

    onLoad() {
        this.initHandleTouch();
        this.effect.setCompleteListener(() => this.changeToLoopAnimation());
    }

    skipTouchToContinue() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
        this.effect.setCompleteListener(() => this.scheduleOnce(this.finish, this.delayFinishDuration));
    }

    changeToLoopAnimation() {
        this.isLoopClip = true;
        this.effect.skeletonData = this.loopSpine;
        this.effect.setAnimation(0, this.effect.animation, false);
    }
}
