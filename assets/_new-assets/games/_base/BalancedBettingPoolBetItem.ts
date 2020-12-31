import { numberTo, numberWithCommas } from "../../common/helpers/Helper";
import BetItem from "./BetItem";

const { ccclass } = cc._decorator;

@ccclass
export default class BalancedBettingPoolBetItem extends BetItem {
    public resetHighlight() {
        this.highlight.active = false;
        if (this.highlightBackground) {
            this.highlightBackground.active = false;
        }
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        this.highlight.active = highlight && isAnimated;
        if (this.highlightBackground) {
            this.highlightBackground.active = highlight && isAnimated;
        }

        if (this.highlightBorder) {
            this.highlightBorder.active = highlight && !isAnimated;
        }

        if (this.normalBorder) {
            this.normalBorder.active = !highlight;
        }
    }

    public balanceBet(bet: number) {
        numberTo(this.totalBet, 0, bet, 1000, true);
    }

    protected setTotalBet(bet: number) {
        this.totalBet.string = numberWithCommas(bet);
    }
}
