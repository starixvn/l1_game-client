import * as helper from "../../../../../_new-assets/common/helpers/Helper";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

export interface BetInfo {
  title: string;
  roundId: string;
  odd: number;
  choice: string;
  minBet: number;
  maxBet: number;
  bet: number;
}

@ccclass
export default class MiniKenoBetBoard extends cc.Component {
  @property(cc.Label)
  title: cc.Label = null;

  @property(cc.Label)
  roundId: cc.Label = null;

  @property(cc.Label)
  choice: cc.Label = null;

  @property(cc.Label)
  winBet: cc.Label = null;

  @property(cc.Label)
  minBet: cc.Label = null;

  @property(cc.Label)
  maxBet: cc.Label = null;

  @property(cc.Label)
  betValue: cc.Label = null;

  @property(cc.Button)
  betButton: cc.Button = null;

  @property(cc.Node)
  background: cc.Node = null;

  private betAmount = 0;
  public betCallback = (betAmount: number, info: BetInfo) => { };
  public getPreset = () => {
    return 0;
  };
  private info: BetInfo;

  public clearBet() {
    this.betAmount = 0;
    this.updateBetAmount();
  }

  public onClose() {
    cc.RedT.audio.playClick();
    this.close();
  }

  public close(enableSound = true) {
    const commonDialog = this.node.children[0].getComponent("CommonDialog");
    commonDialog.closeDialog(enableSound);

    this.node.runAction(cc.sequence(cc.delayTime(commonDialog.time), cc.callFunc(() => {
      this.node.active = false;
    })));

    this.betCallback(0, this.info);
  }

  public onAcceptBet() {
    this.close();
    this.betCallback(this.betAmount, this.info);
  }

  public show(info: BetInfo) {
    this.info = info;
    this.updateInfo();
    this.node.active = true;
    this.node.children[0].active = true;
  }

  private updateInfo() {
    this.betAmount = this.info.bet || this.getPreset();
    this.updateBetAmount();
    this.title.string = this.info.title;
    this.roundId.string = this.info.roundId;
    this.choice.string = `${GameUtils.getBetChoiceString(this.info.choice)} @${
      this.info.odd
      }`;
    this.minBet.string = helper.numberWithCommas(this.info.minBet);
    this.maxBet.string = helper.numberWithCommas(this.info.maxBet);
  }

  public onItemBetClicked(e, index) {
    const amounts = [1, 10, 50, 100, 500, this.info.maxBet];
    const amount = amounts[index];
    if (amount == this.info.maxBet) {
      this.betAmount = amount;
      this.updateBetAmount();
      return;
    }

    if (!this.isValidBet(this.betAmount + amount)) {
      //show warning
      return;
    }

    this.betAmount = this.betAmount + amount;
    this.updateBetAmount();
  }

  private updateBetAmount() {
    this.betValue.string =
      this.betAmount > 0 ? helper.numberWithCommas(this.betAmount) : "";
    const winAmount = this.betAmount * this.info.odd;
    this.winBet.string =
      winAmount > 0 ? helper.numberWithCommas(winAmount) : "";

    const canBet = this.betAmount >= this.info.minBet;
    this.betButton.interactable = canBet;
    this.betButton.node.opacity = canBet ? 255 : 102;
  }

  private isValidBet(betAmount: number): boolean {
    return betAmount <= this.info.maxBet && betAmount >= this.info.minBet;
  }
}
