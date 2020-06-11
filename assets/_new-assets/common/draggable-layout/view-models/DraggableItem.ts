const { ccclass, property } = cc._decorator;

@ccclass
export default class DraggableItem extends cc.Component {

    private startPosition = cc.v2(0, 0);

    public touchCallback = {
        start: (node: cc.Node) => { },
        move: (touchPosition: cc.Vec2) => { },
        end: () => { },
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(e) {
        this.touchCallback.start(this.node);
        this.startPosition = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
    }

    onTouchMove(e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.startPosition.x, e.touch.getLocationY() - this.startPosition.y)
        this.touchCallback.move(e.touch.getLocation());
    }

    onTouchEnd(e) {
        this.touchCallback.end();
    }

    onTouchCancel(e) {
        this.touchCallback.end();
    }
}
