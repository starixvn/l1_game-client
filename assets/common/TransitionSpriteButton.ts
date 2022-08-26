const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionSpriteButton extends cc.Component {
    @property(cc.Node)
    haloEffect: cc.Node = null;

    onEnable() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.eventOnClick, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.eventOffClick, this);
    }
    onDisable() {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.eventOnClick, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.eventOffClick, this);
    }

    eventOnClick() {
        this.haloEffect.active = true;
    }

    eventOffClick() {
        this.haloEffect.active = false;
    }
}
