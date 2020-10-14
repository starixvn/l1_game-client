import { numberTo } from "../../../common/helpers/Helper";
import BetItem from "../../_base/BetItem";

const { ccclass } = cc._decorator;

@ccclass
export default class SpecialSeDieBetItem extends BetItem {
  setTotalBet(bet: number) {
    numberTo(this.totalBet, 0, bet, 1000, true);
  }

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
}
