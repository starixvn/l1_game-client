import * as _ from "lodash";
import RouletteUtils from "./RouletteUtils";

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
    dozen1Percent: cc.Label = null;

    @property(cc.Label)
    dozen2Percent: cc.Label = null;

    @property(cc.Label)
    dozen3Percent: cc.Label = null;

    wheelDegree = 360;
    numberAngle: number = this.wheelDegree / 37;
    numbersOnWheel: number[] = [22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18];
    blackNumbersOnWheel: number[] = [22, 31, 20, 33, 24, 10, 8, 11, 13, 6, 17, 2, 4, 15, 26, 35, 28, 29];

    result = [30, 2, 4, 6, 30, 24, 8, 30, 10, 5, 24, 12, 36, 0, 4, 28, 29, 80, 19, 34, 20, 10, 6, 5, 31, 7, 8, 9]

    resultStats = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.createResultStatistic();

        console.log(this.resultStats);
        this.createWheel();
        this.handleStatsPercent();
    }

    createWheel() {
        let largestNumber = _.maxBy(this.resultStats, 'times').times;
        this.numbersOnWheel.forEach((number, index) => {
            let itemAngle = index * this.numberAngle;
            let numberNode = cc.instantiate(this.numberStatistic);
            let spriteComponent = numberNode.getComponent(cc.Sprite);

            numberNode.active = true;
            numberNode.anchorX = 1;
            numberNode.rotation = - itemAngle;
            numberNode.name = number.toString();

            spriteComponent.type = cc.Sprite.Type.FILLED;
            let foundNumber = _.find(this.resultStats, ["number", number]);
            let numberTimes = 1;
            if (foundNumber != undefined) {
                numberTimes = foundNumber.times;
            }

            spriteComponent.fillStart = 1 - (numberTimes / largestNumber);
            spriteComponent.fillRange = 1;


            if (number === 0) {
                spriteComponent.spriteFrame = this.zeroNumberSprite;
            } else {
                if (this.blackNumbersOnWheel.indexOf(number) !== -1) {
                    spriteComponent.spriteFrame = this.blackNumberSprite;
                }
                else {
                    spriteComponent.spriteFrame = this.redNumberSprite;
                }
            }

            this.wheel.addChild(numberNode);
        })
    }

    handleStatsPercent() {
        this.findHotColdNumbers();
        this.calculateRedBlackPercent();
        this.calculateOddEvenPercent();
        this.calculateBigSmallPercent();
        this.calculateDozenNumbers();
    }

    createResultStatistic() {
        for (let i = 0; i < 37; i++) {
            if (i > 0) {
                this.resultStats.push({
                    "number": i,
                    "times": this.getOccurrence(this.result, i)
                });
            }
        }
    }

    getOccurrence(array, value) {
        var count = 0;
        array.forEach((v) => (v === value && count++));
        return count;
    }

    findHotColdNumbers() {
        this.resultStats.sort((a, b) => { return a.times - b.times });

        let coldNumbers = _.slice(this.resultStats, 0, 4);
        let hotNumbers = _.slice(this.resultStats, this.resultStats.length - 4, this.resultStats.length);

        this.updateHotColdNumbers(this.hotNumberNodes, hotNumbers);
        this.updateHotColdNumbers(this.coldNumberNodes, coldNumbers);
    }

    updateHotColdNumbers(numberNodes: cc.Node, list) {
        numberNodes.children.forEach((number, index) => {
            number.getComponent(cc.Label).string = list[index].number;
            number.getChildByName("times").getComponent(cc.Label).string = list[index].times;
        })
    }

    calculateRedBlackPercent() {
        let redCount = 0;
        let zeroCount = 0;
        this.result.forEach(number => {
            if (number != 0) {
                if (RouletteUtils.isRed(number)) {
                    redCount += 1;
                }
            } else {
                zeroCount += 1;
            }
        })

        let exceptZeroCount = this.result.length - zeroCount;
        let red = _.round((redCount / exceptZeroCount) * 100);
        let black = 100 - red;

        this.redPercent.string = `${red}%`;
        this.blackPercent.string = `${black}%`;
    }

    calculateOddEvenPercent() {
        let oddCount = 0;
        let zeroCount = 0;
        this.result.forEach(number => {
            if (number != 0) {
                if (RouletteUtils.isOdd(number)) {
                    oddCount += 1;
                }
            } else {
                zeroCount += 1;
            }
        })

        let exceptZeroCount = this.result.length - zeroCount;
        let odd = _.round((oddCount / exceptZeroCount) * 100);
        let even = 100 - odd;

        this.oddPercent.string = `${odd}%`;
        this.evenPercent.string = `${even}%`;
    }

    calculateBigSmallPercent() {
        let bigCount = 0;
        let zeroCount = 0;
        this.result.forEach(number => {
            if (number != 0) {
                if (RouletteUtils.isBig(number)) {
                    bigCount += 1;
                }
            } else {
                zeroCount += 1;
            }
        })

        let exceptZeroCount = this.result.length - zeroCount;
        let big = _.round((bigCount / exceptZeroCount) * 100);
        let small = 100 - big;

        this.range1To18Percent.string = `${big}%`;
        this.range19To36Percent.string = `${small}%`;
    }

    calculateDozenNumbers() {
        let zeroCount = 0;
        let dozen1Count = 0;
        let dozen2Count = 0;

        this.result.forEach(number => {
            if (number != 0) {
                if (number > 0 && number <= 12) {
                    dozen1Count += 1;
                } else if (number > 12 && number <= 24) {
                    dozen2Count += 1;
                }
            } else {
                zeroCount += 1;
            }
        })

        let zeroPercent = _.round((zeroCount / this.result.length) * 100);
        let dozen1 = _.round((dozen1Count / this.result.length) * 100);
        let dozen2 = _.round((dozen2Count / this.result.length) * 100);
        let dozen3 = 100 - (zeroPercent + dozen1 + dozen2);

        this.zeroPercent.string = `${zeroPercent}%`;
        this.dozen1Percent.string = `${dozen1}%`;
        this.dozen2Percent.string = `${dozen2}%`;
        this.dozen3Percent.string = `${dozen3}%`;
    }
    // update (dt) {}
}
