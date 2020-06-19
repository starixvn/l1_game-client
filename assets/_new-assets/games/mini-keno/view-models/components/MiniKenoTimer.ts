const { ccclass, property } = cc._decorator;
import * as moment from "moment";
import AnimatedTime from "../../../../common/animated-time/view-models/AnimatedTime";

@ccclass
export default class MiniKenoTimer extends AnimatedTime {
    @property(cc.Label)
    firstHourChar: cc.Label = null;

    @property(cc.Label)
    secondHourChar: cc.Label = null;

    @property(cc.Node)
    hourColon: cc.Node = null;

    @property(cc.Label)
    firstMinuteChar: cc.Label = null;

    @property(cc.Label)
    secondMinuteChar: cc.Label = null;

    private enableHour: boolean = false;

    init(enableHour: boolean) {
        this.enableHour = enableHour;

        if (enableHour) {
            this.firstHourChar.node.parent.active = true;
            this.secondHourChar.node.parent.active = true;
            this.hourColon.active = true;
        }
    }

    setTime(time: string, forceChangeColor = false) {
        this.node.active = true;
        const timeText = moment.utc(parseInt(time) * 1000).format("HH:mm:ss");
        const timeChars = Array.from(timeText);

        if (this.enableHour) {
            this.firstHourChar.string = timeChars[0];
            this.secondHourChar.string = timeChars[1];
        }

        this.firstMinuteChar.string = timeChars[3];
        this.secondMinuteChar.string = timeChars[4];
        this.firstChar.string = timeChars[6];
        this.secondChar.string = timeChars[7];
    }
}
