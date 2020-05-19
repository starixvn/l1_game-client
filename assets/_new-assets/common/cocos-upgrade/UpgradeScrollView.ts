const { ccclass, property } = cc._decorator;
const EPSILON = 1e-4;

@ccclass
export default class UpgradeScrollView extends cc.ScrollView {

    _checkMouseWheel(dt) {
        let currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        let maxElapsedTime = 0.1;

        if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._processInertiaScroll();
            this.unschedule(this._checkMouseWheel);
            this._dispatchEvent('scroll-ended');
            this._stopMouseWheel = false;
            return;
        }

        this._mouseWheelEventElapsedTime += dt;

        // mouse wheel event is ended
        if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
            this._onScrollBarTouchEnded();
            this.unschedule(this._checkMouseWheel);
            this._dispatchEvent('scroll-ended');
            this._stopMouseWheel = false;
        }
    }
}
