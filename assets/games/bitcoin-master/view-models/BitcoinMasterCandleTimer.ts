import ShortAnimatedTime from "../../../common/animated-time/view-models/ShortAnimatedTime";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterCandleTimer extends ShortAnimatedTime {
    private currentTimeRemainingCandle = 0;

    setCandleTime(time: number) {
        const candleLife = 60;
        let candle1 = time > candleLife ? time - candleLife : time;
        this.currentTimeRemainingCandle = candle1;
        this.schedule(this.setLifeTime, 1);
    }

    setLifeTime() {
        this.currentTimeRemainingCandle--;
        if (this.currentTimeRemainingCandle < 0) {
            this.currentTimeRemainingCandle = 60;
        }
        this.setTime(this.currentTimeRemainingCandle.toString());
    }
}
