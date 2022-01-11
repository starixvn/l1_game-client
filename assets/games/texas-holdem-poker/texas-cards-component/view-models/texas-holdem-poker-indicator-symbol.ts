const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasHoldemPokerIndicatorSymbol extends cc.Component {
  @property(cc.Node)
  symbolDealer: cc.Node = null;

  @property(cc.Node)
  symbolPlayer: cc.Node = null;

  onLoad() {
    this.symbolDealer.active = false;
    this.symbolPlayer.active = false;
  }

  updateStateSymbol(who: string) {
    switch (who) {
      case "dealer":
        this.symbolDealer.active = true;
        this.symbolPlayer.active = false;
        break;
      case "player":
        this.symbolDealer.active = false;
        this.symbolPlayer.active = true;
        break;
      case "hideAll":
        this.symbolDealer.active = false;
        this.symbolPlayer.active = false;
        break;
    }
  }
}
