import BounceInEffect from "../../animations/BounceInEffect";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonDialog extends BounceInEffect {
    @property({ override: true })
    time = 0.4;

    private readonly onDidHideActions = [];
    private readonly onWillShowActions = [];

    closeDialog(enableSound = true) {
        cc.tween(this.node)
            .to(this.time, { scale: 0, opacity: 0 }, { easing: "backIn" })
            .call(() => {
                this.node.active = false;
                this.onDidHide();
            })
            .start();

        enableSound && cc.RedT.audio.playUnClick();
    }

    showDialog() {
        this.onWillShow();
        this.node.active = true;
    }

    addOnDidHide(action: () => void) {
        this.onDidHideActions.push(action);
    }

    addOnWillShow(action: () => void) {
        this.onWillShowActions.push(action);
    }

    private onDidHide() {
        this.onDidHideActions.forEach((action) => action());
    }

    private onWillShow() {
        this.onWillShowActions.forEach((action) => action());
    }
}
