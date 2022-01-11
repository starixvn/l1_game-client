const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class TexasTicketHistoryItem extends cc.Component {
  @property(cc.Label)
  time: cc.Label = null;

  @property(cc.Label)
  round: cc.Label = null;

  @property(cc.Label)
  player: cc.Label = null;

  @property(cc.Label)
  dealer: cc.Label = null;

  @property(cc.Label)
  stake: cc.Label = null;

  @property(cc.Label)
  win: cc.Label = null;

  openTicketDetail() {}
}
