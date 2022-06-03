import FadeAppearanceNode from "../../../common/FadeAppearanceNode";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TumbleWinView extends FadeAppearanceNode {
    @property(cc.Label)
    tumbleLabel: cc.Label = null;

    @property(cc.Label)
    multiplier: cc.Label = null;

    @property(cc.Layout)
    tumbleLayout: cc.Layout = null;

    @property(cc.Label)
    totalWin: cc.Label = null;

    onLoad() {
        this.onHidden = () => {
            this.showTotalWin(false);
            this.resetPositionTumbleLabel();
        };
        this.showView(false, true);
        this.showTotalWin(false);
    }

    setTumbleWinValue(value: number, animated: boolean) {
        this.showView(true);
        if (animated) {
            GameUtils.floatToNumber(this.tumbleLabel, value, 0.5);
        } else {
            this.tumbleLabel.string = numberWithCommas(value);
        }
    }

    setTotalWinValue(value: number) {
        this.totalWin.string = numberWithCommas(value);
        this.showTotalWin(true);
    }

    showTotalWin(show: boolean) {
        if (show) {
            this.showNodeAndHideOther(this.totalWin.node, this.tumbleLayout.node);
        } else {
            this.showNodeAndHideOther(this.tumbleLayout.node, this.totalWin.node);
        }
    }

    resetPositionTumbleLabel() {
        this.multiplier.node.active = false;
        this.tumbleLabel.node.x = 0;
        this.tumbleLayout.enabled = false;
    }

    private showNodeAndHideOther(node: cc.Node, otherNode: cc.Node) {
        node.opacity = 0;
        const duration = 0.2;
        cc.tween(node).to(duration, { opacity: 255 }).start();
        cc.tween(otherNode).to(duration, { opacity: 0 }).start();
    }

    setMultiplier(value: number) {
        const changeMultiplier = () => {
            this.multiplier.string = `x${value}`;
            this.multiplier.node.active = true;
            cc.tween(this.multiplier.node)
                .to(0.1, { scale: 1.2 }, { easing: "sineOut" })
                .to(0.1, { scale: 1 }, { easing: "sineIn" })
                .start();
        };
        const isActive = this.multiplier.node.active;
        if (!isActive) {
            const width = this.multiplier.node.width;
            cc.tween(this.tumbleLabel.node)
                .by(0.1, { x: -width / 2 })
                .call(() => {
                    this.tumbleLayout.enabled = true;
                    changeMultiplier();
                })
                .start();
        } else {
            changeMultiplier();
        }
    }
}
