const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratDerivedScoreboardItem extends cc.Component {
    protected readonly NodeItems = {
        RED: "red",
        BLUE: "blue"
    };

    @property([cc.Node])
    nodes: cc.Node[] = [];

    resetNode(point: any) {
        const gap = point.column % 2 === 0 ? 0 : 6;
        const node = this.nodes[point.row + gap];
        for (const name in this.NodeItems) {
            node.getChildByName(name).active = false;
        }
    }

    renderNode(point: any) {
        const gap = point.column % 2 === 0 ? 0 : 6;
        const node = this.nodes[point.row + gap];
        node.getChildByName(this.NodeItems.RED).active = point.status;
        node.getChildByName(this.NodeItems.BLUE).active = !point.status;
    }

    resetAll() {
        for (const node of this.nodes) {
            for (const name in this.NodeItems) {
                node.getChildByName(name).active = false;
            }
        }
    }
}
