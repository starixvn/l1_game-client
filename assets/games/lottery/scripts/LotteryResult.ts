import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import LotteryHelper from "./LotteryHelper";
import LotteryResultNumber from "./LotteryResultNumber";
import SplitLabel from "./SplitLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryResult extends cc.Component {
    @property(CommonDialog)
    dialog: CommonDialog = null;

    @property({ type: LotteryResultNumber })
    resultNumbers: LotteryResultNumber[] = [];

    @property(cc.Node)
    sampleSplitLabel: cc.Node = null;

    @property(cc.Node)
    sampleHighlight: cc.Node = null;

    onLoad() {
        if (this.dialog) {
            this.dialog.onDidHide = () => {
                this.node.destroy();
            };
        }

        this.resultNumbers.forEach((resultNumber) => {
            resultNumber.sampleSplitLabel = this.sampleSplitLabel;
            resultNumber.sampleHighlight = this.sampleHighlight;
        });
    }

    setPrizeLabel(label: cc.Label, value: string, split: boolean) {
        const splitLabel = label.node.children[0].getComponent(SplitLabel);
        if (!split) {
            label.string = value;
        } else {
            const values = [value.slice(0, value.length - 2), value.slice(-2)];
            splitLabel.setString(values);
            splitLabel.labels[1].node.color = cc.Color.GREEN;

            splitLabel.cloneLabelInfo(label);
        }
    }

    setData(data: any, animated: boolean, ownBets: any): Promise<void> {
        const { result } = data;
        const list = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "special"];
        let i = 0;

        const winChoices = LotteryHelper.getWinChoices(data, ownBets);
        const locations = LotteryHelper.getPrizeLocations(data, winChoices);

        if (!animated) {
            list.forEach((key) => {
                result[key].forEach((value) => {
                    const isSeventh = i < 26 && i > 21;
                    const info = locations[i];
                    if (!info) {
                        this.resultNumbers[i].setValue(value);
                    } else {
                        this.resultNumbers[i].setSplitValues(info.text, info.highlight, cc.Color.GREEN);
                    }
                    this.removeLoading(this.resultNumbers[i].node);
                    i++;
                });
            });
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                i = 0;
                const delayTime = 0.14;

                const values = [];
                list.forEach((key) => {
                    result[key].forEach((value) => values.push(value));
                });
                cc.tween(this.node)
                    .repeat(
                        27,
                        cc
                            .tween()
                            .call(() => {
                                const isSeventh = i < 26 && i > 21;
                                const info = locations[i];
                                if (!info) {
                                    this.resultNumbers[i].setValue(values[i]);
                                } else {
                                    this.resultNumbers[i].setSplitValues(info.text, info.highlight, cc.Color.GREEN);
                                    this.resultNumbers[i].setHighlight();
                                }
                                this.removeLoading(this.resultNumbers[i].node);
                                i++;
                            })
                            .delay(delayTime)
                    )
                    .call(() => {
                        this.createSpecialEffect();
                        resolve();
                    })
                    .start();
            });
        }
    }

    createSpecialEffect() {
        const special = this.resultNumbers[this.resultNumbers.length - 1].label.node;
        cc.tween(special)
            .repeat(10, cc.tween().to(0.15, { scale: 1.08 }).to(0.15, { scale: 1 }))
            .start();
    }

    removeLoading(node: cc.Node) {
        const loading = node.getChildByName("loading");
        if (loading) {
            loading.destroy();
        }
    }

    close() {
        this.dialog.closeDialog(false);
    }
}
