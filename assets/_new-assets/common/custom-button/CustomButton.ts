
const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomButton extends cc.Component {
    @property
    fixedShape = false;

    @property({ type: cc.PolygonCollider, visible: function (this: CustomButton) { return this.fixedShape } })
    collider: cc.PolygonCollider = null;

    @property
    parentControl = false;

    public callback = {
        highlight: (highlight: boolean) => { },
        selected: () => { }
    }

    checkCollider(event) {
        if (this.collider) {
            let touchLoc = event.getLocation();
            if (!cc.Intersection.pointInPolygon(touchLoc, this.collider.world.points)) {
                return false;
            }
        }

        return true;
    }

    onLoad() {
        cc.director.getCollisionManager().enabled = true;

        if (!this.parentControl) {
            this.registerEventListener();
        }
    }

    onDestroy() {
        if (!this.parentControl) {
            this.clearEvenListener();
        }
    }

    registerEventListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    clearEvenListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onTouchStart(e) {
        if (!this.checkCollider(e)) {
            return;
        }
        this.callback.highlight(true);
    }

    onTouchMove(e) {
        if (!this.checkCollider(e)) {
            return;
        }
        this.callback.highlight(true);
    }

    onTouchEnd(e) {
        this.callback.highlight(false);
        if (!this.checkCollider(e)) {
            return;
        }
        this.callback.selected();
    }

    onTouchCancel(e) {
        this.callback.highlight(false);
    }
}
