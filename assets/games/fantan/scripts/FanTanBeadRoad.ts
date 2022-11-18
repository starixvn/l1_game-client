import BeadRoad from "../../_base/view-models/BeadRoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanBeadRoad extends BeadRoad {
    reverseDisplayNode(row: number, column: number) {
        return this.rowMax - row - 1; //reverse
    }

    updateContentSize(nodes: cc.Node[]) {
        const columnsCount = Math.ceil(nodes.length / this.rowMax);
        this.content.width = this.startHorizontalPadding + columnsCount * this.horizontalSpacing - this.horizontalSpacing;
    }
}
