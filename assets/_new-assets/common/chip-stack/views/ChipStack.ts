
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChipStack extends cc.Component {

    public chipSize: number = 20;
    public thickness: number = 5;

    onLoad() {
        this.node.anchorY = 0;
    }

    addChip(chipNode: cc.Node) {
        chipNode.position = cc.v2(0, this.getCurrentHeight());
        this.node.addChild(chipNode);
    }

    getCurrentHeight(): number {
        return this.node.childrenCount * this.thickness;
    }
}
