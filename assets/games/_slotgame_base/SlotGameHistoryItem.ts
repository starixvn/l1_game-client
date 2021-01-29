const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameHistoryItem extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Label)
  time: cc.Label = null;

  @property(cc.Label)
  roundID: cc.Label = null;

  @property(cc.Label)
  bet: cc.Label = null;

  @property(cc.Label)
  payLines: cc.Label = null;

  @property(cc.Label)
  totalAmount: cc.Label = null;

  @property(cc.Label)
  win: cc.Label = null;

  @property(cc.Node)
  jackpotIcon: cc.Node = null;

  data: any = null;

  public showTicketDetail = (data: any) => {};

  openTicketDetail() {
    this.showTicketDetail(this.data);
  }
}
