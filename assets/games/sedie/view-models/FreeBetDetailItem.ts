import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetDetailItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Label)
    value: cc.Label = null;

    setData(betType: string, value: number) {
        this.label.string = GameUtils.getBetChoiceString(betType);
        this.value.string = numberWithCommas(value);
    }
}
