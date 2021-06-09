const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomePageView extends cc.PageView {
    _handleReleaseLogic(touch) {
        this._autoScrollToPage();
        if (this._scrolling) {
            this._scrolling = false;
            if (!this._autoScrolling) {
                this._dispatchEvent("scroll-ended");
            }
            const animation = this._pages[this._curPageIdx].getComponent(cc.Animation);
            animation.play();
        }
    }
}
