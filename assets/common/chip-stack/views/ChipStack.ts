import { ApplicationSystem, ICashSystem, ICreditSystem } from "../../../ApplicationSystem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChipStack extends ApplicationSystem implements ICashSystem, ICreditSystem {
    public chipSize = 20;
    public thickness = 3;
    public skewX = 0;
    public ratioPosX = 1.5;

    customizeCredit(): void {
        throw new Error("Method not implemented.");
    }

    customizeCash(): void {
        throw new Error("Method not implemented.");
    }

    onLoad() {
        this.node.anchorY = 0;
    }

    addChip(chipNode: cc.Node) {
        chipNode.position = cc.v2(this.calcPositionX(), this.getCurrentHeight());
        this.node.addChild(chipNode);
    }

    getCurrentHeight(): number {
        return this.node.childrenCount * this.thickness;
    }

    calcPositionX() {
        if (this.skewX === 0) {
            return 0;
        }

        let positionX = 0;

        if (this.skewX > 0) {
            positionX = -this.node.childrenCount * this.ratioPosX;
        }

        if (this.skewX < 0) {
            positionX = this.node.childrenCount * this.ratioPosX;
        }

        return positionX;
    }
}
