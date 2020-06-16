import KenoNumber from "../KenoNumber";
import * as _ from "lodash";
import BetChoice from "../BetChoice";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoRoundResult extends cc.Component {

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Node)
    settleResult: cc.Node = null;

    @property(cc.Node)
    resultNumbers: cc.Node = null;

    private result: number[] = [];
    private settlementResult: any;
    private betChoices: BetChoice[] = [];
    private kenoNumbers: KenoNumber[] = [];

    private readonly choiceMapper = {
        big: "TÀI",
        small: "XỈU",
        odd: "LẺ",
        even: "CHẴN",
        gold: "KIM",
        wood: "MỘC",
        water: "THỦY",
        fire: "HỎA",
        earth: "THỔ",
    };

    onLoad() {
        this.kenoNumbers = this.resultNumbers.children.map(child => child.getComponent(KenoNumber));
        this.kenoNumbers.forEach(keno => keno.show(false));
        this.betChoices = this.settleResult.children.map(child => child.getComponent(BetChoice));
    }

    public setData(result: number[], settlementResult: any) {
        this.result = result;
        this.settlementResult = settlementResult;
    }

    public show(animated: boolean = false, duration: number = 0, onComplete: () => void = () => { }) {
        this.node.active = true;
        if (animated) {
            this.total.string = "0";
            this.kenoNumbers.forEach(keno => keno.show(false));
            var shuffle = [];
            for (var i = 0; i < this.result.length; i++) {
                shuffle.push(i);
            }
            shuffle = _.shuffle(shuffle);

            var i = 0;
            var sequence = cc.sequence(
                cc.callFunc(() => {
                    var index = shuffle[i];
                    this.kenoNumbers[index].setNumber(this.result[index], true);
                    var total = 0;
                    for (var j = 0; j <= i; j++) {
                        total += this.result[shuffle[j]];
                    }
                    this.showSettleResult(this.getSettleResult(total));
                    this.total.string = total.toString();
                    i++;
                }),
                cc.delayTime(duration / this.result.length)
            );

            this.node.runAction(cc.sequence(
                cc.repeat(sequence, this.result.length),
                cc.callFunc(() => {
                    this.total.node.runAction(cc.sequence(
                        cc.scaleTo(.1, 1.2),
                        cc.scaleTo(.1, 1)
                    ));
                    this.betChoices.forEach(label => {
                        label.node.runAction(cc.sequence(
                            cc.scaleTo(.1, 1.2),
                            cc.scaleTo(.1, 1)
                        ));
                    });
                    this.showSettleResult(this.settlementResult);
                    onComplete();
                })));
        } else {
            var total = 0;
            for (let i = 0; i < this.result.length; i++) {
                total += this.result[i];
                this.kenoNumbers[i].setNumber(this.result[i], false);
                this.kenoNumbers[i].show(true);
            }
            this.total.string = total.toString();
            this.showSettleResult(this.settlementResult);
        }
    }

    private getSettleResult(total: number) {
        var settle: any = {};
        if (total > 810) {
            settle.big = true;
        } else {
            settle.small = true;
        }

        if (total % 2 === 1) {
            settle.odd = true;
        } else {
            settle.even = true;
        }

        if (total < 696) {
            settle.gold = true;
        } else if (total < 764) {
            settle.wood = true;
        } else if (total < 856) {
            settle.water = true;
        } else if (total < 1411) {
            settle.fire = true;
        } else {
            settle.earth = true;
        }
        return settle;
    }

    private showSettleResult(settlementResult: any) {
        let index = 0;
        Object.keys(settlementResult).forEach(key => {
            if (settlementResult[key]) {
                var betChoice = this.betChoices[index];
                betChoice.setValue(this.choiceMapper[key]);
                index++;
            }
        });
    }
}
