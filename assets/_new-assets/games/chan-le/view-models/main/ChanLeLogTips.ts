const { ccclass, property } = cc._decorator;

@ccclass
export default class ChanLeLogTips extends cc.Component {

    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Node)
    tips: cc.Node = null;

    sprite: cc.Sprite = null;
    turnId: number;

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
    }

    onEnable() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventHover, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventLeave, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventHover, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventLeave, this);
    }

    eventHover() {
        this.tips.active = true;
    }
    eventLeave() {
        this.tips.active = false;
    }
}
