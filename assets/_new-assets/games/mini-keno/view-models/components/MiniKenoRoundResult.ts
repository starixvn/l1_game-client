import * as _ from "lodash";
import KenoUtils from "../KenoUtils";
import GameUtils from "../../../../common/GameUtils";
import KenoNumber from "../../../keno-pro/view-models/KenoNumber";
import BetChoice from "../../../keno-pro/view-models/BetChoice";
import KenoRoundResult from "../../../keno-pro/view-models/history/KenoRoundResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoRoundResult extends KenoRoundResult {
    @property(cc.Node)
    waitingResultNode: cc.Node;

    private isMini = false;

    init(isMini: boolean) {
        this.isMini = isMini;
    }

    clear() {
        this.kenoNumbers.forEach((number, index) => {
            if (this.isMini && index >= 10) {
                return;
            }

            number.showWaiting();
        });
        this.betChoices.forEach(choice => choice.setValue(""))
        this.total.string = "";
    }

    public show(animated: boolean = false, duration: number = 0, onComplete: () => void = () => { }) {
        this.node.active = true;

        if (animated) {
            this.total.string = "0";

            const miniType = this.result.length < 20;
            let index = 0;
            let total = 0;

            const showNumberAction = cc.sequence(
                cc.callFunc(() => {
                    const number = this.result[index];
                    this.kenoNumbers[index].setNumber(number, true);
                    total += number;
                    this.showSettleResult(KenoUtils.getSettleResult(total, miniType));
                    this.total.string = total.toString();
                    index++;
                }),
                cc.delayTime(duration / this.result.length)
            );

            this.node.runAction(cc.sequence(
                cc.repeat(showNumberAction, this.result.length),
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
            this.node.stopAllActions();
            this.total.node.scale = 1;
            this.betChoices.forEach(label => label.node.scale = 1);

            let total = 0;

            for (let i = 0; i < this.result.length; i++) {
                total += this.result[i];
                this.kenoNumbers[i].setNumber(this.result[i], false);
            }

            this.total.string = total.toString();
            this.showSettleResult(this.settlementResult);
        }
    }
}
