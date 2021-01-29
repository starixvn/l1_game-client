const { ccclass, property } = cc._decorator;

@ccclass
export default class FourGuardiansTicketDetailItem extends cc.Component {
  @property(cc.Label)
  order: cc.Label = null;

  @property(cc.Sprite)
  payline: cc.Sprite = null;

  @property(cc.Sprite)
  symbol: cc.Sprite = null;

  @property(cc.Label)
  amount: cc.Label = null;

  @property(cc.Label)
  payout: cc.Label = null;

  @property(cc.Label)
  bet: cc.Label = null;

  @property(cc.Label)
  win: cc.Label = null;

  @property(cc.Node)
  backhground: cc.Node = null;
}
