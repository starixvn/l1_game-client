const { ccclass, property } = cc._decorator;

@ccclass
export default class HoverEffect extends cc.Component {

    @property(cc.Sprite)
    background: cc.Sprite = null;

    @property(cc.SpriteFrame)
    normalSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    highlightSprite: cc.SpriteFrame = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.eventOnHover, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.eventOffHover, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.eventOffHover, this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.eventOnHover, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.eventOffHover, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.eventOffHover, this);

        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
    }

    eventOnHover(e) {
        this.background.spriteFrame = this.highlightSprite;
    }

    eventOffHover(e) {
        this.background.spriteFrame = this.normalSprite;
    }
}
