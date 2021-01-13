import { numberWithCommas } from "../../../common/helpers/NumberHelper.js";
import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoBetItem extends BetItem {
    protected setTotalBet(bet: number) {
        if (this.totalBet) {
            this.totalBet.string = bet > 0 ? numberWithCommas(bet, 1) : "";
        }
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        super.setHighlightItems(highlight, isAnimated);
        if (this.highlightBorder) {
            this.highlightBorder.active = highlight && !isAnimated;
        }
    }
}
