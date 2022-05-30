import MD5Tooltip from "./MD5Tooltip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MD5CasinoTooltip extends MD5Tooltip {
    @property(cc.Node)
    blockInputNode: cc.Node = null;

    eventOnHover() {
        super.eventOnHover();
        this.blockInputNode.active = true;
    }

    eventOffHover() {
        super.eventOffHover();
        this.blockInputNode.active = false;
    }

    hideToolTip() {
        super.hideToolTip();
        this.blockInputNode.active = false;
    }
}
