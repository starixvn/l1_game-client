import { easeCubicActionInOut, easing, easeOut, easeSineIn, easeCircleActionIn, easeCubicActionIn } from '../../../../../creator';
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

    // shakeIndicator() {
    //     const action = cc.repeatForever(cc.sequence(cc.rotateTo(0.13, -10).easing(cc.easeOut(2)), cc.rotateBy(0.13, 3).easing(cc.easeOut(5))));
    //     action.setTag(100);

    //     this.indicator.getChildByName("indicator").runAction(action);
    // }

    spin() {
        this.button.interactable = false;

        let result = Math.floor(Math.random() * (30 - 1) + 1);
        this.point = this.scoinPresents[result - 1];
        this.resultLabel.string = result.toString();

        let randomPosition = Math.random() * ((this.defaultAngle - 5) - 5) + 5;
        console.log(randomPosition);
        let offsetAngleResult = 360 - (this.wheel.angle % 360);
        const rotateResult = (result * this.defaultAngle) + (8 * 360) - offsetAngleResult - randomPosition;

        let action = cc.sequence(
            cc.rotateBy(this.gameTime, rotateResult).easing(cc.easeBezierAction(0, 0.9, 0.99999999, 1)),
            cc.callFunc(() => {
                this.button.interactable = true;
                this.button.node.opacity = 255;
            }));
        this.wheel.runAction(action);
    }
}
