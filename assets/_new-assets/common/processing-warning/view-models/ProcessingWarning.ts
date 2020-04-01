const { ccclass, property } = cc._decorator;

@ccclass
export default class ProcessingWarning extends cc.Component {

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    private waitTime: number = 5;
    private title: string = "Cược đang được xử lí, vui lòng đợi trong giây lát!";
    private countDownId: number;

    onEnable() {
        var self = this;
        this.titleLabel.string = this.title;
        this.timeLabel.string = this.waitTime.toString();
        var waitTime = this.waitTime;

        this.countDownId = setInterval(function () {
            waitTime--;

            if (waitTime == 0) {
                clearInterval(this.countDownId);
            }
            self.timeLabel.string = waitTime.toString();
        }, 1000);

        this.node.runAction(cc.sequence(
            this.showWarning,
            cc.delayTime(this.waitTime),
            this.hideWarning,
            this.destroyNode
        ));
    }

    public setWaitTime(waitTime: number) {
        this.waitTime = waitTime;
    }

    public setTitle(title: string) {
        this.title = title;
    }

    public close() {
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(this.hideWarning, this.destroyNode));
        clearInterval(this.countDownId);
    }

    private showWarning: cc.ActionInstant = cc.spawn(
        cc.scaleTo(0.09, 1),
        cc.fadeTo(0.09, 255)
    )

    private hideWarning: cc.ActionInstant = cc.spawn(
        cc.scaleTo(0.09, 1.5),
        cc.fadeTo(0.09, 0)
    )

    private destroyNode: cc.ActionInstant = cc.callFunc(function () {
        this.node.destroyAllChildren();
        this.node.destroy();
    }, this)
}
