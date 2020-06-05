import MiniRoundHistoryItem from "./MiniRoundHistoryItem";
import MiniRoundHistoryTip from "./MiniRoundHistoryTip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniRoundHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(MiniRoundHistoryTip)
    tip: MiniRoundHistoryTip = null;

    protected items: MiniRoundHistoryItem[] = [];
    protected selectedNode: cc.Node = null;
    private listener = {
        onEnter: (node: cc.Node) => {
            this.selectedNode = node;
            this.tip.node.position = cc.v2(node.x, this.tip.node.y);
            let data = node.getComponent(MiniRoundHistoryItem).data;
            this.tip.setData(data);
            this.tip.show();
        },
        onLeave: (node: cc.Node) => {
            this.selectedNode = null;
            this.tip.show(false);
        },
    }

    onLoad() {
        this.items = this.content.children.map(child => child.getComponent(MiniRoundHistoryItem));
        this.items.forEach(item => {
            item.node.active = false;
            item.listener = this.listener;
        });
    }

    protected onUpdate(node: cc.Node) {
        const data = node.getComponent(MiniRoundHistoryItem).data;
        this.tip.node.active && this.tip.setData(data);
    }

    public setData(datas: any[]) {
        this.items.forEach((item, index) => {
            if (index >= datas.length) {
                return;
            }
            let value = datas[index];
            item.setData(value);
            item.node.active = true;
        });
        this.selectedNode && this.onUpdate(this.selectedNode);
    }
}
