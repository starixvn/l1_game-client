import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolItem extends cc.Component {
    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    setData(itemData: any) {
        this.stake.string = numberWithCommas(itemData.pool);
        GameUtils.floatToNumber(this.amount, itemData.amount, 1, 0, false);
        this.node.active = true;
    }

    setHighlight(highlight: boolean) {
        if (this.highlight) {
            this.highlight.active = highlight;
        }
    }
}
