// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteStatistic extends cc.Component {

    @property(cc.Node)
    numberStatistic: cc.Node = null;

    wheelDegree = 360;
    numberAngle: number = this.wheelDegree / 37;
    numbers: number[] = [22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let i = 0; i < 37; i++) {
            let itemAngle = i * this.numberAngle;
            let number = cc.instantiate(this.numberStatistic);
            number.active = true;
            number.anchorX = 1;
            number.rotation = itemAngle;
            number.name = this.numbers[i].toString();
            this.node.addChild(number);
        }
    }

    start() {

    }

    // update (dt) {}
}
