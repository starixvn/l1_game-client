import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolItem extends cc.Component {
    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    setData(amount: number) {
        GameUtils.floatToNumber({ label: this.amount, amount: this.convertCurrencyValue(amount), duration: 1, noZeroSuffix: false });
        this.node.active = true;
    }

    convertCurrencyValue(amount: number) {
        return amount;
    }

    setHighlight(highlight: boolean) {
        if (this.highlight) {
            this.highlight.active = highlight;
        }
    }
}
