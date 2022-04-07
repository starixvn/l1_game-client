import MD5Tip from "./MD5Tip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MD5Tooltip extends cc.Component {
    @property(MD5Tip)
    tip: MD5Tip = null;

    public data: string;

    public setData(data: string) {
        this.data = data;
    }

    onEnable() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.eventOnHover, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.eventOffHover, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.eventOnHover, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.eventOffHover, this);
    }

    eventOnHover() {
        this.tip.setData(this.data);
        this.tip.show(!!this.data);
    }

    eventOffHover() {
        this.tip.show();
    }

    hideToolTip() {
        this.tip.show();
    }
}
