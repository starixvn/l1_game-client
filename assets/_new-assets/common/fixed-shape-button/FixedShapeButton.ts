const { ccclass, property } = cc._decorator;

@ccclass
export default class FixedShapeButton extends cc.Button {

    @property(cc.PolygonCollider)
    collider: cc.PolygonCollider = null;

    start() {
        // Open the collision manager, without this part statement you will not detect any collision.
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    _onTouchBegan(event) {
        let touch = event.touch;
        let touchLoc = touch.getLocation();
        if (!cc.Intersection.pointInPolygon(touchLoc, this.collider.world.points)) {
            return;
        }

        //super
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = true;
        this._updateState();
        event.stopPropagation();
    }
}
