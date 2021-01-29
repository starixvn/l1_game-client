const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameTopWinnerItem extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Label)
  time: cc.Label = null;

  @property(cc.Label)
  player: cc.Label = null;

  @property(cc.Label)
  amount: cc.Label = null;

  @property(cc.Label)
  win: cc.Label = null;
}
