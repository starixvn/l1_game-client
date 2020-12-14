import MiniRoundHistory from '../../../common/mini-round-history/MiniRoundHistory';
import VipBaccaratMiniRoundHistoryItem from './VipBaccaratMiniRoundHistoryItem';
import BlinkNode from '../../../common/BlinkNode';

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccaratMiniRoundHistory extends MiniRoundHistory {
  @property(cc.Node)
  nodeNext: cc.Node = null;

  protected checkShowNext = () => false;
  nodeHighlight: cc.Node = null;
  protected dataLogs: any[] = [];

  init(condition: () => boolean) {
    this.checkShowNext = condition;
  }

  public setData(data: any[]) {
    this.dataLogs = data;
    this.items.forEach((item, index) => {
      if (index >= data.length) {
        return;
      }
      let value = data[index];
      item.setData(value);

      // handle next dot
      if (index == 0) {
        this.nodeNext.addComponent(BlinkNode).interval = 0.5;
        this.nodeNext.active = false;
        this.nodeHighlight = item.node;
      }

      item.node.active = true;
    });

    this.selectedNode && this.onUpdate(this.selectedNode);
  }

  public updateOrderNode(data: any[]) {
    this.items.forEach((item, index) => {
      if (index >= data.length) {
        return;
      }

      // ignore first node, when the next node active
      if (index > 0) {
        let value = data[index - 1];
        item.setData(value);
        item.node.active = true;
      }
    });
    this.selectedNode && this.onUpdate(this.selectedNode);
  }

  protected onUpdate(node: cc.Node) {
    const data = node.getComponent(VipBaccaratMiniRoundHistoryItem).data;
    this.tip.node.active && this.tip.setData(data);
  }

  update() {
    this.nodeNext.active = this.checkShowNext();
    if (this.nodeHighlight && this.nodeHighlight.isValid) {
      if (this.nodeNext.active) {
        this.updateOrderNode(this.dataLogs);
        this.nodeHighlight.active = false;
      } else {
        this.nodeHighlight.active = true;
      }
    }
  }
}
