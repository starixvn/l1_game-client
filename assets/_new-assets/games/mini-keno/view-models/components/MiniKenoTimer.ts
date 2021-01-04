import * as moment from "moment";

import AnimatedTime from "../../../../common/animated-time/view-models/AnimatedTime";

const { ccclass, property } = cc._decorator;
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

    private enableHour = false;
    private readonly numberMoveTime = 0.4;

    init(enableHour: boolean, animatedYTop = 60, animatedYBottom = -10) {
        this.enableHour = enableHour;

        if (enableHour) {
            this.firstHourChar.node.parent.parent.active = true;
            this.secondHourChar.node.parent.parent.active = true;
            this.hourColon.active = true;
        }

        this.setAnimatedY(animatedYTop, animatedYBottom);
    }

    setTime(time: string, forceChangeColor = false) {
        this.node.active = true;
        const timeText = moment.utc(parseInt(time) * 1000).format("HH:mm:ss");
        const timeChars = Array.from(timeText);

        this.firstHourChar && this.showTimeNumber(this.firstHourChar, timeChars[0]);
        this.secondHourChar && this.showTimeNumber(this.secondHourChar, timeChars[1]);
        this.firstMinuteChar && this.showTimeNumber(this.firstMinuteChar, timeChars[3]);
        this.secondMinuteChar && this.showTimeNumber(this.secondMinuteChar, timeChars[4]);
        this.firstChar && this.showTimeNumber(this.firstChar, timeChars[6]);
        this.secondChar && this.showTimeNumber(this.secondChar, timeChars[7]);
    }

    resetTime() {
        this.firstHourChar.string = "0";
        this.secondHourChar.string = "0";
        this.firstMinuteChar.string = "0";
        this.secondMinuteChar.string = "0";
        this.firstChar.string = "0";
        this.secondChar.string = "0";
    }

    private showTimeNumber(timeLabel: cc.Label, time: string) {
        if (time === timeLabel.string) {
            return;
        }

        timeLabel.string = time;
        this.handleBetTimeAnimation(timeLabel.node);
    }
}
