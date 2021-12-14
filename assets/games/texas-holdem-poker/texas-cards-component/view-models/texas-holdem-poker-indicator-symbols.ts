const { ccclass, property } = cc._decorator;
import TexasHoldemPokerIndicatorSymbol from "./texas-holdem-poker-indicator-symbol";
@ccclass
export default class TexasHoldemPokerIndicatorSymbols extends cc.Component {
  @property(TexasHoldemPokerIndicatorSymbol)
  indicatorSymbolTop: TexasHoldemPokerIndicatorSymbol = null;

  @property(TexasHoldemPokerIndicatorSymbol)
  indicatorSymbolBottom: TexasHoldemPokerIndicatorSymbol = null;

  showSymbol(position: string, whose: string) {
    switch (position) {
      case "top":
        this.indicatorSymbolTop.updateStateSymbol(whose);
        this.indicatorSymbolTop.node.active = true;
        this.indicatorSymbolBottom.node.active = true;

        break;
      case "bottom":
        this.indicatorSymbolBottom.updateStateSymbol(whose);
        this.indicatorSymbolTop.node.active = true;
        this.indicatorSymbolBottom.node.active = true;
        break;
    }
  }
  hideAllArrow() {
    this.indicatorSymbolTop.node.active = false;
    this.indicatorSymbolBottom.node.active = false;
    this.indicatorSymbolTop.updateStateSymbol("hideAll");
    this.indicatorSymbolBottom.updateStateSymbol("hideAll");
  }
}
