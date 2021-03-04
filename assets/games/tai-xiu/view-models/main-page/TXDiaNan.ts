const { ccclass } = cc._decorator;

@ccclass
export default class TXDiaNan extends cc.Component {
    init(obj) {
        this.RedT = obj;
    }
    onLoad() {
        this.ttOffset = null;
    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    }
    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    }
    eventStart(e) {
        this.setTop();
        this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    }
    eventMove(e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
    }
    eventEnd() {}
    setTop() {
        this.RedT.setTop();
    }
});
