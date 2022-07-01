const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingWarningTrialMode extends cc.Component {
    showView(show: boolean) {
        this.node.opacity = show ? 255 : 0;
    }

    showHaveAnim() {
        cc.tween(this.node).to(0.1, { opacity: 255 }).delay(0.4).blink(0.8, 2).delay(3.6).to(0.1, { opacity: 0 }).start();
    }
}
