const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyMoneyWheel extends cc.Component {

    @property(cc.Node)
    wheel: cc.Node = null;

    @property(cc.Button)
    button: cc.Button = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    scoinPresents: any[] = [1, 10, 5, 2, 1, 10, 5, 0, 2, 1, 10, 5, 2, 1, 10, 5, 2, 1, 10, 5, 2, 1, 0, 10, 5, 2, 1, 10, 5, 2];
    defaultAngle: number = 360 / this.scoinPresents.length;
    gameTime: number = 4;
    point: number = null;

    // onLoad() {

    // }

    spin() {
        this.button.interactable = false;

        let result = Math.floor(Math.random() * (30 - 1) + 1);
        this.point = this.scoinPresents[result - 1];
        this.resultLabel.string = result.toString();

        let randomPosition = Math.random() * (20 - 6) + 6;
        let offsetAngleResult = 360 - (this.wheel.angle % 360);
        let rotateResult = (result * this.defaultAngle) + 3600 - offsetAngleResult - randomPosition;

        let action = cc.sequence(
            cc.rotateBy(this.gameTime, rotateResult).easing(cc.easeQuarticActionInOut()),
            // cc.delayTime(1),
            cc.callFunc(() => {
                //this.showWinningEffect(true);
            }),
            // cc.delayTime(3),
            cc.callFunc(() => {
                this.button.interactable = true;
                this.button.node.opacity = 255;
            }));
        this.wheel.runAction(action);
    }

    // _easeQuarticActionInOut = {
    //     easing: function (time) {
    //         time = time * 2;
    //         if (time <= 0.2)
    //             return 0.25 * time * time * time * time;

    //         if (time > 0.2 && time <= 0.7)
    //             return 0.35 * time * time;

    //         if (time > 0.7 && time < 1)
    //             return 0.5 * time * time * time * time * time * time * time * time * time * time;
    //         time -= 2;
    //         return -0.5 * (time * time * time * time - 2);
    //     },
    //     reverse: function () {
    //         return this._easeQuarticActionInOut;
    //     }
    // };

    // easeQuarticActionInOut() {
    //     return this._easeQuarticActionInOut;
    // }
}
