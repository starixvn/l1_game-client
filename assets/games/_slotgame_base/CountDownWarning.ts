import AnimatedTime from '../../common/animated-time/view-models/AnimatedTime';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CountDownWarning extends cc.Component {
    @property(AnimatedTime)
    time: AnimatedTime = null;

    @property(cc.Label)
    spinCount: cc.Label = null;

    @property
    duration = 3;

    private isShowing = false;
    private checkCancel = () => false;

    show(spinCount: number, onFinished = () => {}, checkCancel = () => false) {
        this.spinCount.string = spinCount.toString();
        this.checkCancel = checkCancel;
        this.node.active = true;
        this.setTime(this.duration);
        let count = 1;
        this.isShowing = true;
        this.schedule(this.updateInterval, 0.3, cc.macro.REPEAT_FOREVER, 1);
        cc.tween(this.node)
            .repeat(
                this.duration,
                cc
                    .tween()
                    .delay(1)
                    .call(() => {
                        this.setTime(this.duration - count);
                        count++;
                    })
            )
            .call(() => {
                this.unschedule(this.updateInterval);
                this.node.active = false;
                this.isShowing = false;
                onFinished();
            })
            .start();
    }

    updateInterval() {
        if (!this.isShowing) {
            return;
        }

        if (this.checkCancel()) {
            this.unschedule(this.updateInterval);
            this.node.stopAllActions();
            this.node.active = false;
            this.isShowing = false;
        }
    }

    setTime(time: number) {
        const num = String(time).padStart(2, "0");
        this.time.setTime(num);
    }
}
