import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotAnimatedTimer extends AnimatedTime {
    @property(cc.Node)
    waitingContainer: cc.Node = null;

    @property(cc.Node)
    waitingDot1: cc.Node = null;

    @property(cc.Node)
    waitingDot2: cc.Node = null;

    @property(cc.Node)
    waitingDot3: cc.Node = null;

    isShowWaiting = false;

    setRedTime(time: number) {
        this.timeToChangeColor = time;
    }

    public hasChangedColor(color: cc.Color) {
        this.changedColor = color;
        return this;
    }

    setAnimatedY(yTop: number, yBottom: number) {
        this.animatedYTop = yTop;
        this.animatedYBottom = yBottom;
    }

    resetTime() {}

    public setTime(time: number | string, forceChangeColor = false) {
        console.log("setTime");
        this.node.active = true;
        const firstTimeChar = time.toString().substr(0, 1);
        const secondTimeChar = time.toString().substr(1, 1);

        if (this.firstChar.string !== firstTimeChar) {
            this.handleBetTimeAnimation(this.firstChar.node);
        }

        this.handleBetTimeAnimation(this.secondChar.node);
        this.firstChar.string = firstTimeChar;
        this.secondChar.string = secondTimeChar;

        const colorChange = forceChangeColor || (this.timeToChangeColor != undefined && time <= this.timeToChangeColor);
        this.firstChar.node.color = colorChange ? this.changedColor : cc.Color.WHITE;
        this.secondChar.node.color = this.firstChar.node.color;

        if (colorChange) {
            this.playAnimationLockBet();
        }
    }
    public setTimeToWhiteColor(time: number, forceAnimate = false) {
        this.node.active = true;
        const firstTimeChar = time.toString().substr(0, 1);
        const secondTimeChar = time.toString().substr(1, 1);
        if (forceAnimate) {
            if (this.firstChar.string !== firstTimeChar) {
                this.handleBetTimeAnimation(this.firstChar.node);
            }
            this.handleBetTimeAnimation(this.secondChar.node);
        }
        this.firstChar.string = firstTimeChar;
        this.secondChar.string = secondTimeChar;
        this.firstChar.node.color = cc.Color.WHITE;
        this.secondChar.node.color = this.firstChar.node.color;
    }

    //   public hasJumpAnimation(hasJump: boolean) {
    //     this.hasJump = hasJump;
    //     return this;
    //   }

    handleBetTimeAnimation(node: cc.Node) {}

    public showWaiting() {
        if (this.isShowWaiting) {
            return;
        }

        const anim = this.waitingContainer.getComponent(cc.Animation);

        this.waitingContainer.active = true;
        anim.play();
    }

    public showHideCountdown(show: boolean) {
        this.firstChar.node.active = show;
        this.secondChar.node.active = show;
    }

    playAnimationLockBet() {
        cc.tween(this.firstChar.node).to(0.1, { scale: 1.3 }).to(0.1, { scale: 1 }).start();
        cc.tween(this.secondChar.node).to(0.1, { scale: 1.3 }).to(0.1, { scale: 1 }).start();
    }
}
