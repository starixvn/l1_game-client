import ShortAnimatedTime from "../../../common/animated-time/view-models/ShortAnimatedTime";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterCandleTimer extends cc.Component {
    @property(ShortAnimatedTime)
    animatedTime: ShortAnimatedTime = null;

    private currentTimeRemainingCandle = 0;
    private readonly candleLife = 60;

    setCandleTime(time: number) {
        this.currentTimeRemainingCandle = time > this.candleLife ? time - this.candleLife : time;
        this.setLifeTime();
        this.unschedule(this.setLifeTime);
        this.schedule(this.setLifeTime, 1);
        this.animatedTime.setRedTime(-1);
    }

    protected setLifeTime() {
        if (this.currentTimeRemainingCandle < 1) {
            this.currentTimeRemainingCandle = this.candleLife;
        }

        this.animatedTime.setTime(this.currentTimeRemainingCandle.toString());
        this.currentTimeRemainingCandle--;
    }
}
