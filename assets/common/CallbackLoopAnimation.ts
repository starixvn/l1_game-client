import CallbackAnimation from "./CallbackAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CallbackLoopAnimation extends CallbackAnimation {
    @property(cc.AnimationClip)
    loopClip: cc.AnimationClip = null;

    private isLoopClip = false;
    private tapCount = 0;

    public skipCallback = () => {};

    onLoad() {
        this.initHandleTouch();
        this.animation.on("finished", () => this.changeToLoopAnimation());
    }

    initHandleTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
    }

    handleTouch() {
        this.tapCount++;
        if (this.tapCount === 1) {
            if (!this.isLoopClip) {
                this.changeToLoopAnimation();
            }
            this.skipCallback();
            this.scheduleOnce(this.finish, 3);
        }
        if (this.tapCount === 2) {
            this.unschedule(this.finish);
            this.finish();
        }
    }

    changeToLoopAnimation() {
        this.isLoopClip = true;
        this.animation.addClip(this.loopClip);
        this.animation.play(this.loopClip.name);
    }

    finish() {
        this.onFinishedCallback();
        this.node.destroy();
    }
}
