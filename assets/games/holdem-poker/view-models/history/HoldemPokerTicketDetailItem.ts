const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Games/HolemPoker/HoldemPokerTicketDetailItem")
export default class HoldemPokerTicketDetailItem extends cc.Component {
  @property(cc.Label)
  bettingOption: cc.Label = null;

  @property(cc.Label)
  stake: cc.Label = null;

  @property(cc.Label)
  win: cc.Label = null;

  @property(cc.Label)
  odd: cc.Label = null;

  @property(cc.Label)
  time: cc.Label = null;

  @property(cc.Node)
  bgRow: cc.Node = null;
}
