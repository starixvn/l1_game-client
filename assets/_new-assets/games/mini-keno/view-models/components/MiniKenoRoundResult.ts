import * as _ from "lodash";
import KenoUtils from "../KenoUtils";
import KenoRoundResult from "../../../keno-pro/view-models/history/KenoRoundResult";
import MiniKeno from "../MiniKeno";
import MiniKenoProViet from "../../../mini-keno-pro-viet/view-models/MiniKenoProViet";
import * as moment from "moment";
import { zeroPad } from "../../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoRoundResult extends KenoRoundResult {
    @property(cc.Node)
    roundInfo: cc.Node = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    roundTime: cc.Label = null;

    private miniKeno: MiniKeno;

    public setData(result: number[], settlementResult: any, roundId: number = 0, roundTime: string = null) {
        super.setData(result, settlementResult);

        if (roundId && roundTime) {
            this.roundInfo.active = true;
            this.roundId.string = `Kỳ vé: #${zeroPad(roundId, 7)}`;
            this.roundTime.string = "Thời gian: " + moment(roundTime).format(MiniKenoProViet.DATETIME_FORMAT)
        }
        else {
            this.roundInfo.active = false;
        }
    }

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;;
    }

    clear() {
        this.kenoNumbers.forEach((number, index) => {
            if (this.miniKeno.isMiniKeno && index >= 10) {
                return;
            }

            number.showWaiting();
        });
        this.betChoices.forEach(choice => choice.setValue(""))
        this.total.string = "";
        this.roundInfo && (this.roundInfo.active = false);
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
                    const settlementResult = KenoUtils.getSettleResult(total, miniType);
                    this.showSettleResult(settlementResult);
                    this.miniKeno.highlightWonItem(settlementResult, true);
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
                    this.miniKeno.highlightWonItem(this.settlementResult, false);
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
            this.miniKeno.highlightWonItem(this.settlementResult, false);
        }
    }
}
