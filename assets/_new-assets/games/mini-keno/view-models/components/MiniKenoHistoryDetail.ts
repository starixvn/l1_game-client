import * as _ from "lodash";

import GameUtils from "../../../../common/GameUtils";
import { formatDateTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import KenoNumber from "../../../keno-pro/view-models/KenoNumber";
import MiniKenoHistoryDetailItem from "./MiniKenoHistoryDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoHistoryDetail extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Node)
    settleResult: cc.Node = null;

    @property(cc.Node)
    resultNumbers: cc.Node = null;

    @property(cc.Prefab)
    prefabDetail: cc.Prefab = null;

    @property(cc.Node)
    betDetails: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private result: number[] = [];
    private settlementResult: any;
    private resultLabels: cc.Label[] = [];
    private kenoNumbers: KenoNumber[] = [];

    onLoad() {
        this.kenoNumbers = this.resultNumbers.children.map((child) => child.getComponent(KenoNumber));
        this.resultLabels = this.settleResult.children.map((child) => child.getComponent(cc.Label));

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    public setData(result: number[], settlementResult: any, betLogDetails: any[]) {
        this.result = result;
        this.settlementResult = settlementResult;
        betLogDetails.forEach((item) => {
            const node = cc.instantiate(this.prefabDetail);
            const detailItem: MiniKenoHistoryDetailItem = node.getComponent("MiniKenoHistoryDetailItem");
            detailItem.time.string = formatDateTime(item.time);
            detailItem.choice.string = GameUtils.getBetChoiceString(item.choice);
            detailItem.amount.string = numberWithCommas(item.amount);
            this.betDetails.addChild(node);
        });
    }

    public show(animated = false, duration = 0, onComplete: () => void = () => {}) {
        this.node.active = true;
        this.resultLabels.forEach((label) => (label.node.active = false));
        if (animated) {
            this.total.string = "0";
            this.kenoNumbers.forEach((keno) => keno.show(false));
            let shuffle = [];
            for (let index = 0; index < this.result.length; index++) {
                shuffle.push(index);
            }
            shuffle = _.shuffle(shuffle);

            let i = 0;
            const sequence = cc.sequence(
                cc.callFunc(() => {
                    const index = shuffle[i];
                    this.kenoNumbers[index].setNumber(this.result[index], true);
                    let total = 0;
                    for (let j = 0; j <= i; j++) {
                        total += this.result[shuffle[j]];
                    }
                    this.showSettleResult(this.getSettleResult(total));
                    this.total.string = total.toString();
                    i++;
                }),
                cc.delayTime(duration / this.result.length)
            );

            this.node.runAction(
                cc.sequence(
                    cc.repeat(sequence, this.result.length),
                    cc.callFunc(() => {
                        this.total.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1)));
                        this.resultLabels.forEach((label) => {
                            label.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1)));
                        });
                        this.showSettleResult(this.settlementResult);
                        onComplete();
                    })
                )
            );
        } else {
            let total = 0;
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
        const settle: any = {};
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
        Object.keys(settlementResult).forEach((key) => {
            if (settlementResult[key]) {
                const label = this.resultLabels[index];
                label.node.active = true;
                label.string = GameUtils.getBetChoiceString(key);
                index++;
            }
        });
    }
}
