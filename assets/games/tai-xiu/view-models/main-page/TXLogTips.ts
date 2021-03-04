const { ccclass, property } = cc._decorator;

@ccclass
export default class TXLogTips extends cc.Component {
    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Node)
    tips: cc.Node = null;

    sprite: cc.Sprite = null;

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
    }
    onEnable() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnENTER, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLEAVE, this);
    }
    onDisable() {
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnENTER, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLEAVE, this);
    }
    eventOnENTER() {
        this.tips.active = !0;
    }
    eventOnLEAVE() {
        this.tips.active = !1;
    }
}
