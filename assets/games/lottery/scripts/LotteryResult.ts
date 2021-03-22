import CommonDialog from "../../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryResult extends cc.Component {
    @property({ type: cc.Node })
    prizeContainers: cc.Node[] = [];

    @property(cc.Node)
    loading: cc.Node = null;

    @property(CommonDialog)
    dialog: CommonDialog = null;

    @property(cc.Prefab)
    loadingPrefab: cc.Prefab = null;

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
            if (this.loadingPrefab) {
                const node = cc.instantiate(this.loadingPrefab);
                label.node.addChild(node);
                node.name = "loading";
            }
        });

        if (this.dialog) {
            this.dialog.onDidHide = () => {
                this.node.destroy();
            };
        }
    }

    setData(data: any, animated: boolean): Promise<void> {
        const list = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "special"];
        let i = 0;

        if (!animated) {
            list.forEach((key) => {
                data[key].forEach((value) => {
                    this.prizeLabels[i].string = value;
                    this.removeLoading(this.prizeLabels[i].node);
                    i++;
                });
            });
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                i = 0;
                let keyIndex = 0;
                const delayTime = 0.2;
                const listSize = list.length;
                cc.tween(this.node)
                    .repeat(
                        listSize,
                        cc
                            .tween()
                            .call(() => {
                                data[list[keyIndex]].forEach((value) => {
                                    this.prizeLabels[i].string = value;
                                    this.removeLoading(this.prizeLabels[i].node);
                                    i++;
                                });
                                keyIndex++;
                                if (keyIndex === listSize) {
                                    this.createSpecialEffect();
                                }
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
