import MiniRoundHistoryItem from './MiniRoundHistoryItem';
import MiniRoundHistoryTip from './MiniRoundHistoryTip';
import BlinkNode from '../../common/BlinkNode';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniRoundHistory extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(MiniRoundHistoryTip)
  tip: MiniRoundHistoryTip = null;

  @property(cc.Node)
  nodeNext: cc.Node = null;

  protected items: MiniRoundHistoryItem[] = [];
  protected selectedNode: cc.Node = null;
  private listener = {
    onEnter: (node: cc.Node) => {
      this.selectedNode = node;
      this.tip.node.position = cc.v2(node.x, this.tip.node.y);
      const data = node.getComponent(MiniRoundHistoryItem).data;
      this.tip.setData(data);
      this.tip.show();
    },
    onLeave: (node: cc.Node) => {
      this.selectedNode = null;
      this.tip.show(false);
    },
  };

  protected checkShowNext = () => false;
  protected nodeHighlight: cc.Node = null;
  protected dataLogs: any[] = [];

  onLoad() {
    this.items = this.content.children.map((child) => child.getComponent(MiniRoundHistoryItem));
    this.items.forEach((item) => {
      item.node.active = false;
      item.listener = this.listener;
    });
  }

  init(condition: () => boolean) {
    this.checkShowNext = condition;
  }

  protected onUpdate(node: cc.Node) {
    const data = node.getComponent(MiniRoundHistoryItem).data;
    this.tip.node.active && this.tip.setData(data);
  }

  public setData(data: any[]) {
    this.dataLogs = data;
    this.items.forEach((item, index) => {
      if (index >= data.length) {
        return;
      }
      const value = data[index];
      item.setData(value);
      this.handleNextDot(index, item);
      item.node.active = true;
    });
    this.selectedNode && this.onUpdate(this.selectedNode);
  }

  protected updateOrderNode(data: any[]) {
    this.items.forEach((item, index) => {
      if (index >= data.length) {
        return;
      }

      // ignore first node, when the next node active
      if (index > 0) {
        const value = data[index - 1];
        item.setData(value);
        item.node.active = true;
      }
    });
    this.selectedNode && this.onUpdate(this.selectedNode);
  }

  protected handleNextDot(index: number, item: any) {
    if (index == 0 && this.nodeNext && this.nodeNext.isValid) {
      this.nodeNext.addComponent(BlinkNode).interval = 0.5;
      this.nodeNext.active = false;
      this.nodeHighlight = item.node;
    }
  }

  update() {
    if (this.nodeNext && this.nodeNext.isValid) {
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
}
