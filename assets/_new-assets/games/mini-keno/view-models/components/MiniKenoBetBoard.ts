
const { ccclass, property } = cc._decorator;

export interface BetInfo {
  choice: string;
  bet: number;
  betItem: cc.Node;
}

@ccclass
export default class MiniKenoBetBoard extends cc.Component {
  private betAmount = 0;
  private betChoice = "";
  private currentItem: cc.Node = null;

  public callback = {
    acceptedBet: (betAmount: number, choice: string, betItem: cc.Node) => { },
    changedBet: (betAmount: number, betItem: cc.Node) => { },
    cancel: (betItem: cc.Node) => { },
    getPreset: () => 0,
  }

  public onAcceptBet() {
    this.close();
    this.callback.acceptedBet(this.betAmount, this.betChoice, this.currentItem);
  }

  public onCloseClick() {
    cc.RedT.audio.playClick();
    this.close();
  }

  public close() {
    this.node.active = false;
    this.callback.cancel(this.currentItem);
  }

  public show(info: BetInfo) {
    this.currentItem && this.callback.cancel(this.currentItem)

    this.currentItem = info.betItem;
    this.betChoice = info.choice;
    this.betAmount = info.bet || this.callback.getPreset();
    this.node.active = true;
    this.betChanged();
  }

  public onItemBetClicked(e) {
    cc.RedT.audio.playClick();
    const amount = +e.target.name;
    this.betAmount += amount;
    this.betChanged();
  }

  private betChanged() {
    this.callback.changedBet(this.betAmount, this.currentItem);
  }
}
