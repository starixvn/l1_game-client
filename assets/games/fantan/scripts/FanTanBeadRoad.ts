import BeadRoad from "../../_base/view-models/BeadRoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanBeadRoad extends BeadRoad {
    reverseDisplayNode(row: number, column: number) {
        return this.rowMax - row - 1; //reverse
    }
}
