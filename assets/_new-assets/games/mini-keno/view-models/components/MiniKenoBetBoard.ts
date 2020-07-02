
const { ccclass, property } = cc._decorator;

export interface BetInfo {
  choice: string;
  bet: number;
  betItem: cc.Node;
  maxBet: number;
}

@ccclass
export default class MiniKenoBetBoard extends cc.Component {
  @property(cc.Button)
  okButton: cc.Button = null;

  public info: BetInfo = null;

  public callback = {
    acceptedBet: (info: BetInfo) => { },
    changedBet: (info: BetInfo) => { },
    cancel: (info: BetInfo) => { },
    getPreset: () => 0,
  }

  public onAcceptBet() {
    this.close();
    this.callback.acceptedBet(this.info);
  }

  public onCloseClick() {
    cc.RedT.audio.playClick();
    this.close();
  }

  public close() {
    this.node.active = false;
    this.info && this.callback.cancel(this.info);
  }

  public show(info: BetInfo) {
    this.info && this.callback.cancel(this.info);

    this.info = info;
    this.info.bet = info.bet || this.callback.getPreset();
    this.node.active = true;
    this.betChanged();
  }

  public onItemBetClicked(e) {
    cc.RedT.audio.playClick();
    const amount = parseInt(e.target.name) || this.info.maxBet;
    this.info.bet += amount;
    this.info.bet = Math.min(this.info.bet, this.info.maxBet);
    this.betChanged();
  }

  private betChanged() {
    this.callback.changedBet(this.info);
    this.okButton.interactable = this.info.bet > 0;
  }
}
