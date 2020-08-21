import { easeCubicActionInOut, easing, easeOut, easeSineIn, easeCircleActionIn, easeCubicActionIn, bezierTo, tween } from '../../../../../creator';
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

    @property(cc.Label)
    availSpinsLbl: cc.Label = null;

    @property(cc.Label)
    totalScoinLbl: cc.Label = null;

    scoinPresents: any[] = [2, 5, 10, 1, 2, 5, 10, 0, 1, 2, 5, 10, 1, 2, 5, 10, 1, 2, 5, 10, 1, 2, 0, 5, 10, 1, 2, 5, 10, 1];
    defaultAngle: number = 360 / this.scoinPresents.length;
    gameTime: number = 6;
    scoin: number = 0;
    currentRotation: number = 0;
    lastRotation: number = 0;
    progress: number = 0;
    ratioWheel: number = 0;

    availSpins: number = 8;
    totalScoin: number = 10;

    timeTween: cc.Tween;
    indicatorTween: cc.Tween;

    onLoad() {
        this.availSpinsLbl.string = this.availSpins.toString();
        this.totalScoinLbl.string = `${this.totalScoin}$`;
    }

    shakeIndicator() {
        this.progress = 0;

        this.timeTween?.stop();
        this.indicatorTween?.stop();

        this.timeTween = cc.tween(this).to(0.26, { progress: 0.26 }).start();
        this.indicatorTween = cc.tween(this.indicator)
            .to(0.13, { angle: -10 }, {
                easing: t => {
                    return this.customizeBezierAnimation(t);
                }
            })
            .to(0.13, { angle: 3 }, {
                easing: t => {
                    return this.customizeBezierAnimation(t);
                }
            })
            .start();
    }

    spin() {
        this.button.interactable = false;

        let result = Math.floor(Math.random() * (this.scoinPresents.length - 1) + 1);
        this.scoin = this.scoinPresents[result - 1];
        this.resultLabel.string = result.toString();

        let randomPosition = Math.random() * ((this.defaultAngle - 5) - 5) + 5;
        let offsetAngleResult = 360 - (this.wheel.angle % 360);
        const rotateResult = (result * this.defaultAngle) + (8 * 360) + offsetAngleResult - randomPosition;

        this.shakeIndicator();
        cc.tween(this.wheel)
            .by(this.gameTime, { angle: rotateResult }, {
                progress: (start, end, current, ratio) => {
                    this.ratioWheel = ratio;
                    this.currentRotation = this.wheel.angle;
                    const tolerance = this.currentRotation - this.lastRotation;
                    const temp = Math.round(this.currentRotation) % (360 / this.scoinPresents.length);
                    if (temp <= tolerance) {
                        if (this.progress > 0.2) {
                            this.shakeIndicator();
                        }
                    }
                    this.lastRotation = this.currentRotation;
                    return start + (end - start) * ratio;
                },
                easing: t => {
                    return this.customizeBezierAnimation(t);
                },
            })
            .call(() => {
                this.button.interactable = true;
            })
            .start();
    }

    customizeBezierAnimation(time) {
        const point1 = 0, point2 = 0.69, point3 = 0.99999999, point4 = 1;
        return (Math.pow(1 - time, 3) * point1 + 3 * time * (Math.pow(1 - time, 2)) * point2 + 3 * Math.pow(time, 2) * (1 - time) * point3 + Math.pow(time, 3) * point4);
    }
}
