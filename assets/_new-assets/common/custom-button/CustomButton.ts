
const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomButton extends cc.Component {
    @property
    fixedShape = false;

    @property({ type: cc.PolygonCollider, visible: function (this: CustomButton) { return this.fixedShape } })
    collider: cc.PolygonCollider = null;

    public callback = {
        highlight: (highlight: boolean) => { },
        selected: () => { }
    }

    _onTouchBegan(event) {
        if (this.fixedShape && this.collider) {
            let touch = event.touch;
            let touchLoc = touch.getLocation();
            if (!cc.Intersection.pointInPolygon(touchLoc, this.collider.world.points)) {
                return;
            }
        }

        super._onTouchBegan(event);
    }

    onLoad() {
        cc.director.getCollisionManager().enabled = true;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onTouchStart(e) {
        this.callback.highlight(true);
    }

    onTouchMove(e) {
        this.callback.highlight(true);
    }

    onTouchEnd(e) {
        this.callback.highlight(false);
        this.callback.selected();
    }

    onTouchCancel(e) {
        this.callback.highlight(false);
    }
}
