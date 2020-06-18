const { ccclass, property } = cc._decorator;
import * as moment from "moment";
import AnimatedTime from "../../../../common/animated-time/view-models/AnimatedTime";

@ccclass
export default class MiniKenoTimer extends AnimatedTime {

    @property(cc.Label)
    firstMinuteChar: cc.Label = null;

    @property(cc.Label)
    secondMinuteChar: cc.Label = null;

    setTime(time: string, forceChangeColor = false) {
        console.log(time);
        this.node.active = true;
        const timeText = moment.utc(parseInt(time) * 1000).format("mm:ss");
        const timeChars = Array.from(timeText);

        this.firstMinuteChar.string = timeChars[0];
        this.secondMinuteChar.string = timeChars[1];
        this.firstChar.string = timeChars[3];
        this.secondChar.string = timeChars[4];
    }
}
