const { ccclass, property } = cc._decorator;

@ccclass
export default class CullingPanel extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    update() {
        const children = this.content.children;
        const nodeRect = new cc.Rect(-this.node.width / 2, -this.node.height / 2, this.node.width, this.node.height);
        children.forEach(child => {
            const worldPositon = this.content.convertToWorldSpaceAR(child.position);
            const nodePosition = this.node.convertToNodeSpaceAR(worldPositon);
            const rect = new cc.Rect(nodePosition.x - child.width / 2, nodePosition.y - child.height / 2, child.width, child.height);
            child.active = rect.intersects(nodeRect);
        });

    }
}
