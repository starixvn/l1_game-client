const { ccclass, property } = cc._decorator;

@ccclass
export default class FadeAppearanceNode extends cc.Component {
    @property
    appearanceDuration = 0.2;

    onHidden = () => {};
    isShowing = false;

    private appearanceTween: cc.Tween;

    showView(show: boolean, force = false): void {
        const duration = this.appearanceDuration;
        if (show) {
            if (!this.isShowing || force) {
                this.isShowing = true;
                this.appearanceTween && this.appearanceTween.stop();
                this.appearanceTween = cc.tween(this.node).to(duration, { opacity: 255 }).start();
            }
        } else {
            if (this.isShowing || force) {
                this.isShowing = false;
                this.appearanceTween && this.appearanceTween.stop();
                this.appearanceTween = cc
                    .tween(this.node)
                    .to(duration, { opacity: 0 })
                    .call(() => this.onHidden())
                    .start();
            }
        }
    }
}
