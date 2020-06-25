import KenoNumber from "../KenoNumber";
import * as _ from "lodash";
import BetChoice from "../BetChoice";
import KenoUtils from "../../../mini-keno/view-models/KenoUtils";
import GameUtils from "../../../../common/GameUtils";

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

    protected result: number[] = [];
    protected settlementResult: any;
    protected betChoices: BetChoice[] = [];
    protected kenoNumbers: KenoNumber[] = [];

    onLoad() {
        this.kenoNumbers = this.resultNumbers.children.map(child => child.getComponent(KenoNumber));
        this.kenoNumbers.forEach(keno => keno.hide());
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
            this.kenoNumbers.forEach(keno => keno.hide());
            let shuffle = [];

            for (let i = 0; i < this.result.length; i++) {
                shuffle.push(i);
            }

            shuffle = _.shuffle(shuffle);

            let i = 0;
            const miniType = this.result.length < 20;
            const sequence = cc.sequence(
                cc.callFunc(() => {
                    const index = shuffle[i];
                    this.kenoNumbers[index].setNumber(this.result[index], true);
                    let total = 0;
                    for (let j = 0; j <= i; j++) {
                        total += this.result[shuffle[j]];
                    }
                    this.showSettleResult(KenoUtils.getSettleResult(total, miniType));
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
            let total = 0;
            for (let i = 0; i < this.result.length; i++) {
                total += this.result[i];
                this.kenoNumbers[i].setNumber(this.result[i], false);
            }
            this.total.string = total.toString();
            this.showSettleResult(this.settlementResult);
        }
    }

    protected showSettleResult(settlementResult: any) {
        let index = 0;
        Object.keys(settlementResult).forEach(key => {
            if (settlementResult[key]) {
                const betChoice = this.betChoices[index];
                const choice = GameUtils.getBetChoiceString(key);
                betChoice.setValue(choice.toUpperCase());
                index++;
            }
        });
    }
}
