import KenoNumber from "../KenoNumber";
import * as _ from "lodash";

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
    private resultLabels: cc.Label[] = [];
    private kenoNumbers: KenoNumber[] = [];

    private readonly choiceMapper = {
        big: "Tài",
        small: "Xỉu",
        odd: "Lẻ",
        even: "Chẵn",
        gold: "Kim",
        wood: "Mộc",
        water: "Thủy",
        fire: "Hỏa",
        earth: "Thổ",
    };

    onLoad() {
        this.kenoNumbers = this.resultNumbers.children.map(child => child.getComponent(KenoNumber));
        this.kenoNumbers.forEach(keno => keno.show(false));
        this.resultLabels = this.settleResult.children.map(child => child.getComponent(cc.Label));
    }

    public setData(result: number[], settlementResult: any) {
        this.result = result;
        this.settlementResult = settlementResult;
    }

    public show(animated: boolean = false, duration: number = 0, onComplete: () => void = () => { }) {
        this.node.active = true;
        this.resultLabels.forEach(label => label.node.active = false);
        if (animated) {
            this.total.string = "0";
            this.kenoNumbers.forEach(keno => keno.show(false));
            var shuffle = [];
            for (var i = 0; i < 20; i++) {
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
                    this.total.string = total.toString();
                    i++;
                }),
                cc.delayTime(duration / 20)
            );

            this.node.runAction(cc.sequence(
                cc.repeat(sequence, 20),
                cc.callFunc(() => this.showSettleResult()),
                cc.callFunc(() => onComplete())));
        } else {
            var total = 0;
            for (let i = 0; i < this.result.length; i++) {
                total += this.result[i];
                this.kenoNumbers[i].setNumber(this.result[i], false);
                this.kenoNumbers[i].show(true);
            }
            this.total.string = total.toString();
            this.showSettleResult();
        }
    }

    private showSettleResult() {
        let index = 0;
        Object.keys(this.settlementResult).forEach(key => {
            if (this.settlementResult[key]) {
                this.resultLabels[index].node.active = true;
                this.resultLabels[index].string = this.choiceMapper[key];
                index++;
            }
        });
    }
}
