import SicBoRoundHistoryItem from './SicBoRoundHistoryItem';
const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoRoundHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    protected items: SicBoRoundHistoryItem[] = [];
    protected selectedNode: cc.Node = null;

    onLoad() {
        this.items = this.content.children.map(child => child.getComponent(SicBoRoundHistoryItem));
        this.items.forEach(item => {
            item.node.active = false;
        });
    }

    public setData(data: any[]) {
        this.items.forEach((item, index) => {
            if (index >= data.length) {
                return;
            }
            let value = data[index];
            item.setData(value);
            item.node.active = true;
        });
    }
}
