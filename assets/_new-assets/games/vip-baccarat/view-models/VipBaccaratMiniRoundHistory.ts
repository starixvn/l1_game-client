import MiniRoundHistory from '../../../common/mini-round-history/MiniRoundHistory';
import VipBaccaratMiniRoundHistoryItem from './VipBaccaratMiniRoundHistoryItem';
const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccaratMiniRoundHistory extends MiniRoundHistory {
  public setData(data: any[]) {
    this.items.forEach((item, index) => {
      if (index >= data.length) {
        return;
      }
      let value = data[index];
      item.setData(value);
      item.node.active = true;
    });
    this.selectedNode && this.onUpdate(this.selectedNode);
  }

  protected onUpdate(node: cc.Node) {
    const data = node.getComponent(VipBaccaratMiniRoundHistoryItem).data;
    this.tip.node.active && this.tip.setData(data);
  }
}
