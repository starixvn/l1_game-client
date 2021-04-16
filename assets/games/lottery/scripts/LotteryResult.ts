import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import SplitLabel from "./SplitLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryResult extends cc.Component {
    @property({ type: cc.Node })
    prizeContainers: cc.Node[] = [];

    @property(cc.Node)
    loading: cc.Node = null;

    @property(CommonDialog)
    dialog: CommonDialog = null;

    @property(cc.Node)
    sampleSplitLabel: cc.Node = null;

    prizeLabels: cc.Label[] = [];

    onLoad() {
        this.prizeContainers.forEach((container) => {
            if (container.childrenCount > 0) {
                container.children.forEach((child) => {
                    const lbl = child.getComponent(cc.Label);
                    if (lbl) {
                        this.prizeLabels.push(lbl);
                    }
                });
            } else {
                const label = container.getComponent(cc.Label);
                if (label) {
                    this.prizeLabels.push(label);
                }
            }
        });

        this.prizeLabels.forEach((label) => {
            label.string = "";

            const splitLabel = cc.instantiate(this.sampleSplitLabel);
            label.node.addChild(splitLabel);
        });

        if (this.dialog) {
            this.dialog.onDidHide = () => {
                this.node.destroy();
            };
        }
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

    setData(data: any, animated: boolean): Promise<void> {
        const list = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "special"];
        let i = 0;

        if (!animated) {
            list.forEach((key) => {
                data[key].forEach((value) => {
                    this.setPrizeLabel(this.prizeLabels[i], value, true);
                    this.removeLoading(this.prizeLabels[i].node);
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
                    data[key].forEach((value) => values.push(value));
                });
                cc.tween(this.node)
                    .repeat(
                        27,
                        cc
                            .tween()
                            .call(() => {
                                const isSeventh = i < 26 && i > 21;
                                this.setPrizeLabel(this.prizeLabels[i], values[i], !isSeventh);
                                this.removeLoading(this.prizeLabels[i].node);
                                i++;
                            })
                            .delay(delayTime)
                    )
                    .call(resolve)
                    .start();
            });
        }
    }

    createSpecialEffect() {
        const special = this.prizeLabels[this.prizeLabels.length - 1].node;
        special.scale = 2;
        this.node.runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));
        cc.tween(special).to(0.3, { scale: 1 }, { easing: "sineOut" }).start();
    }

    removeLoading(node: cc.Node) {
        const loading = node.getChildByName("loading");
        if (loading) {
            loading.destroy();
        }
    }

    showLoading(show: boolean) {
        this.loading.active = show;
    }

    close() {
        this.dialog.closeDialog(false);
    }
}
