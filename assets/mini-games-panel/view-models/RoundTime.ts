import AnimatedTime from "../../common/animated-time/view-models/AnimatedTime";
import { numberPad } from "../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundTime extends cc.Component {
    @property(AnimatedTime)
    animatedTime: AnimatedTime = null;

    onLoad() {
        this.animatedTime.setAnimatedY(0, 0);
    }

    resetTime() {
        this.animatedTime.setTime(``);
    }

    setTime(time: number) {
        this.animatedTime.setTime(`${numberPad(time, 2)}`);
    }
}
