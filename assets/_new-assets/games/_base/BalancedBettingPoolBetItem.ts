import { numberTo } from "../../common/helpers/Helper";
import BetItem from "./BetItem";

const { ccclass } = cc._decorator;

@ccclass
export default class BalancedBettingPoolBetItem extends BetItem {
  public resetHighlight() {
    this.highlight.active = false;
    this.highlightBackground && (this.highlightBackground.active = false);
  }

  protected setHighlightItems(highlight: boolean, isAnimated = true) {
    this.highlight.active = highlight && isAnimated;
    this.highlightBackground && (this.highlightBackground.active = highlight && isAnimated);

    this.highlightBorder && (this.highlightBorder.active = highlight && !isAnimated);
    this.normalBorder && (this.normalBorder.active = !highlight);
  }

  public balanceBet(bet: number) {
    numberTo(this.totalBet, 0, bet, 1000, true);
  }
}
