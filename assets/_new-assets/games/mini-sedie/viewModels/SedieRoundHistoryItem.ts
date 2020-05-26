const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundHistoryItem extends cc.Component {

    @property(cc.Label)
    value: cc.Label = null;

    @property
    tip = false;

    public red: number = 0;

    public setValue(value: number) {
        this.red = value;
        if (this.value) {
            this.value.string = value.toString();
        }
    }

    public listener = {
        onEnter: (node: cc.Node) => { },
        onLeave: (node: cc.Node) => { },
    }

    onEnable() {
        if (this.tip) {
            this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
            this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
        }
    }

    onDisable() {
        if (this.tip) {
            this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
            this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
        }
    }

    eventOnEnter() {
        this.listener.onEnter(this.node);
    }

    eventOnLeave() {
        this.listener.onLeave(this.node);
    }
}
