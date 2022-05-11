import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TumbleWinView extends cc.Component {
    @property(cc.Label)
    tumbleLabel: cc.Label = null;

    setValue(value: number, animated: boolean) {
        if (animated) {
            GameUtils.floatToNumber(this.tumbleLabel, value, 0.5);
        } else {
            this.tumbleLabel.string = numberWithCommas(value);
        }
    }
}
