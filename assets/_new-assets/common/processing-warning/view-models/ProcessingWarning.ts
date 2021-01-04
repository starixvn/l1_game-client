const { ccclass, property } = cc._decorator;

@ccclass
export default class ProcessingWarning extends cc.Component {
    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    private waitTime = 5;
    private title = "Cược đang được xử lý. Vui lòng đợi trong giây lát.";
    private countDownId: number;

    onEnable() {
        this.titleLabel.string = this.title;
        var waitTime = this.waitTime;

        this.countDownId = setInterval(function () {
            waitTime--;

            if (waitTime === 0) {
                clearInterval(this.countDownId);
            }
        }, 1000);

        this.node.runAction(cc.sequence(this.showWarning, cc.delayTime(this.waitTime), this.hideWarning, this.destroyNode));
    }

    onDestroy() {
        clearInterval(this.countDownId);
    }

    public setWaitTime(waitTime: number) {
        this.waitTime = waitTime;
    }

    public setTitle(title: string) {
        this.title = title;
    }

    public close() {
        if (this.node !== null) {
            this.node.runAction(cc.sequence(this.hideWarning, this.destroyNode));
        }
    }

    private readonly showWarning: cc.ActionInstant = cc.spawn(cc.scaleTo(0.09, 1), cc.fadeTo(0.09, 255));

    private readonly hideWarning: cc.ActionInstant = cc.spawn(cc.scaleTo(0.09, 1.5), cc.fadeTo(0.09, 0));

    private readonly destroyNode: cc.ActionInstant = cc.callFunc(function () {
        this.node.destroyAllChildren();
        this.node.destroy();
    }, this);
}
