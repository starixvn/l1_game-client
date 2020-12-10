import MiniRoundHistoryItem from '../../../common/mini-round-history/MiniRoundHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipBaccaratMiniRoundHistoryItem extends MiniRoundHistoryItem {
  @property(cc.Node)
  icon: cc.Node = null;

  @property(cc.SpriteFrame)
  dotFrame: cc.SpriteFrame = null;

  public setData(data: any) {
    this.data = data;
    const result = data.settlementResult;
    let color = cc.Color.BLACK;
    if (result.tie) {
      this.icon.color = color.fromHEX("#f29f00");
    } else {
      this.icon.color = result.banker ? color.fromHEX("#be2f2c") : color.fromHEX("#002ee6");
    }
  }
}
