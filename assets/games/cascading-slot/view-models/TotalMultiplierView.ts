import FadeAppearanceNode from "../../../common/FadeAppearanceNode";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TotalMultiplierView extends FadeAppearanceNode {
    @property(cc.Label)
    total: cc.Label = null;

    onLoad() {
        this.showView(false);
    }

    setValue(value: number, animated: boolean) {
        if (animated) {
            GameUtils.floatToNumber(this.total, value, 0.2, null, true, "x");
        } else {
            this.total.string = `x${value}`;
        }
        this.showView(true);
    }
}
