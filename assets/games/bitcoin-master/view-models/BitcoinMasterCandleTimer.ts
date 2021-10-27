import ShortAnimatedTime from "../../../common/animated-time/view-models/ShortAnimatedTime";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterCandleTimer extends ShortAnimatedTime {
    private currentTimeRemainingCandle = 0;
    private readonly candleLife = 60;

    setCandleTime(time: number) {
        const convertTime = time - 1;
        this.currentTimeRemainingCandle = convertTime > this.candleLife ? convertTime - this.candleLife : convertTime;

        this.setLifeTime();
        this.unschedule(this.setLifeTime);
        this.schedule(this.setLifeTime, 1);
    }

    setLifeTime() {
        if (this.currentTimeRemainingCandle < 1) {
            this.currentTimeRemainingCandle = this.candleLife;
        }
        console.log("setLifeTime ", this.currentTimeRemainingCandle);
        this.setTime(this.currentTimeRemainingCandle.toString());
        this.currentTimeRemainingCandle--;
    }
}
