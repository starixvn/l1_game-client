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
    private readonly numberMoveTime = 0.4;

    init(enableHour: boolean) {
        this.enableHour = enableHour;

        if (enableHour) {
            this.firstHourChar.node.parent.parent.active = true;
            this.secondHourChar.node.parent.parent.active = true;
            this.hourColon.active = true;
        }
    }

    setTime(time: string, forceChangeColor = false) {
        this.node.active = true;
        const timeText = moment.utc(parseInt(time) * 1000).format("HH:mm:ss");
        const timeChars = Array.from(timeText);

        this.showTimeNumber(this.firstHourChar, timeChars[0]);
        this.showTimeNumber(this.secondHourChar, timeChars[1]);
        this.showTimeNumber(this.firstMinuteChar, timeChars[3]);
        this.showTimeNumber(this.secondMinuteChar, timeChars[4]);
        this.showTimeNumber(this.firstChar, timeChars[6]);
        this.showTimeNumber(this.secondChar, timeChars[7]);
    }

    resetTime() {
        this.firstHourChar.string = "0"
        this.secondHourChar.string = "0"
        this.firstMinuteChar.string = "0"
        this.secondMinuteChar.string = "0"
        this.firstChar.string = "0"
        this.secondChar.string = "0"
    }

    private showTimeNumber(timeLabel: cc.Label, time: string) {
        if (time === timeLabel.string) {
            return;
        }

        const tempCharNode = cc.instantiate(timeLabel.node);
        timeLabel.node.parent.addChild(tempCharNode);
        timeLabel.string = time;
        timeLabel.node.opacity = 0;

        timeLabel.node.runAction(
            cc.sequence(
                cc.moveBy(0, cc.v2(0, 27)),
                cc.spawn(
                    cc.moveBy(this.numberMoveTime, cc.v2(0, -27)).easing(cc.easeCircleActionOut()),
                    cc.fadeIn(this.numberMoveTime / 2)
                )
            )
        )

        tempCharNode.runAction(cc.sequence(
            cc.moveBy(this.numberMoveTime, cc.v2(0, -27)).easing(cc.easeCircleActionOut()),
            cc.delayTime(this.numberMoveTime),
            cc.callFunc(() => {
                tempCharNode.destroy();
            })
        ))
    }
}
