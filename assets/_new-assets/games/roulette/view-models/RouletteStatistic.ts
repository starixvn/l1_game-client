import * as _ from "lodash";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteStatistic extends cc.Component {

    @property(cc.Node)
    wheel: cc.Node = null;

    @property(cc.Node)
    numberStatistic: cc.Node = null;

    @property(cc.SpriteFrame)
    blackNumberSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    redNumberSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    zeroNumberSprite: cc.SpriteFrame = null;

    @property(cc.Node)
    hotNumberNodes: cc.Node = null;

    @property(cc.Node)
    coldNumberNodes: cc.Node = null;

    @property(cc.Label)
    redPercent: cc.Label = null;

    @property(cc.Label)
    blackPercent: cc.Label = null;

    @property(cc.Label)
    evenPercent: cc.Label = null;

    @property(cc.Label)
    oddPercent: cc.Label = null;

    @property(cc.Label)
    range1To18Percent: cc.Label = null;

    @property(cc.Label)
    range19To36Percent: cc.Label = null;

    @property(cc.Label)
    zeroPercent: cc.Label = null;

    @property(cc.Label)
    range1To12Percent: cc.Label = null;

    @property(cc.Label)
    range13To24Percent: cc.Label = null;

    @property(cc.Label)
    range25To36Percent: cc.Label = null;

    wheelDegree = 360;
    numberAngle: number = this.wheelDegree / 37;
    numbers: number[] = [22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18];
    blackNumbers: number[] = [22, 31, 20, 33, 24, 10, 8, 11, 13, 6, 17, 2, 4, 15, 26, 35, 28, 29];
    resultStats: number[] = [50, 20, 2, 14, 3, 2, 13, 36, 4, 15, 1, 13, 9, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.createWheel();
        this.handleStatsPercent();
    }

    sortingResultStats(numbers) {
        numbers.sort((a, b) => a - b);
        return numbers;
    }

    createWheel() {
        let largestNumber = _.max(this.resultStats);

        for (let i = 0; i < 37; i++) {
            let itemAngle = i * this.numberAngle;
            let number = cc.instantiate(this.numberStatistic);
            let spriteComponent = number.getComponent(cc.Sprite);

            number.active = true;
            number.anchorX = 1;
            number.rotation = - itemAngle;
            number.name = this.numbers[i].toString();

            spriteComponent.type = cc.Sprite.Type.FILLED;
            spriteComponent.fillStart = this.resultStats[i] / largestNumber;
            spriteComponent.fillRange = 1;


            if (this.numbers[i] === 0) {
                spriteComponent.spriteFrame = this.zeroNumberSprite;
            } else {
                if (this.blackNumbers.indexOf(this.numbers[i]) !== -1) {
                    spriteComponent.spriteFrame = this.blackNumberSprite;
                }
                else {
                    spriteComponent.spriteFrame = this.redNumberSprite;
                }
            }

            this.wheel.addChild(number);
        }
    }

    handleStatsPercent() {
        let newResult = [];
        this.resultStats.forEach((item, index) => {
            if (this.numbers[index] != 0) {
                newResult.push({
                    number: this.numbers[index],
                    times: item
                })
            }
        });

        newResult.sort((a, b) => { return a.times - b.times });

        let coldNumbers = _.slice(newResult, 0, 4);
        let hotNumbers = _.slice(newResult, newResult.length - 4, newResult.length);

        this.updateHotColdNumbers(this.hotNumberNodes, hotNumbers);
        this.updateHotColdNumbers(this.coldNumberNodes, coldNumbers);
    }

    updateHotColdNumbers(numberNodes: cc.Node, list) {
        numberNodes.children.forEach((number, index) => {
            number.getComponent(cc.Label).string = list[index].number;
            number.getChildByName("times").getComponent(cc.Label).string = list[index].times;
        })
    }
    // update (dt) {}
}
