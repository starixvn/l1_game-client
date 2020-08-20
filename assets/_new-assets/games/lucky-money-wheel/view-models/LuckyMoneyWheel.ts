import { easeCubicActionInOut, easing, easeOut, easeSineIn, easeCircleActionIn, easeCubicActionIn, bezierTo } from '../../../../../creator';
const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyMoneyWheel extends cc.Component {

    @property(cc.Node)
    wheel: cc.Node = null;

    @property(cc.Node)
    indicator: cc.Node = null;

    @property(cc.Button)
    button: cc.Button = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    scoinPresents: any[] = [1, 10, 5, 2, 1, 10, 5, 0, 2, 1, 10, 5, 2, 1, 10, 5, 2, 1, 10, 5, 2, 1, 0, 10, 5, 2, 1, 10, 5, 2];
    defaultAngle: number = 360 / this.scoinPresents.length;
    gameTime: number = 6;
    point: number = null;
    currentRotation: number = null;
    lastRotation: number = null;

    shakeIndicator() {
        if (!this.indicator.getActionByTag(100)) {
            const action = cc.sequence(cc.rotateTo(0.13, -10).easing(cc.easeOut(2)), cc.rotateTo(0.13, 3).easing(cc.easeOut(5)));
            action.setTag(100);
            //this.indicator.stopActionByTag(100);
            this.indicator.runAction(action);
            console.log("action")
        }
    }

    spin() {
        this.button.interactable = false;

        let result = Math.floor(Math.random() * (30 - 1) + 1);
        this.point = this.scoinPresents[result - 1];
        this.resultLabel.string = result.toString();

        let randomPosition = Math.random() * ((this.defaultAngle - 5) - 5) + 5;
        console.log(randomPosition);
        let offsetAngleResult = 360 - (this.wheel.angle % 360);
        const rotateResult = (result * this.defaultAngle) + (8 * 360) - offsetAngleResult - randomPosition;

        cc.tween(this.wheel)
            .by(this.gameTime, { angle: rotateResult }, {
                progress: (start, end, current, ratio) => {
                    this.currentRotation = this.wheel.angle;
                    const tolerance = 5;//this.currentRotation - this.lastRotation;
                    const temp = Math.round(this.currentRotation) % (360 / 30);
                    console.log("temp: " + temp);
                    if (temp <= tolerance) {
                        this.shakeIndicator();
                    }
                    this.lastRotation = this.currentRotation;
                    return start + (end - start) * ratio;
                },
                easing: t => {
                    const a = 0, d = 1, b = 0.9, c = 0.99999999;

                    return (Math.pow(1 - t, 3) * a + 3 * t * (Math.pow(1 - t, 2)) * b + 3 * Math.pow(t, 2) * (1 - t) * c + Math.pow(t, 3) * d);
                },
            })
            .call(() => {
                this.button.interactable = true;
            })
            .start();
    }
}
