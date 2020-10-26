const { ccclass, property } = cc._decorator;

@ccclass
export default class FadeEffectButton extends cc.Component {
    private isSelected: boolean = undefined;

    setActive(status: boolean = true) {
        if (this.isSelected == status) {
            return;
        }

        this.isSelected = status;
        this.node.stopAllActions();

        if (status) {
            this.node.active = status;
            this.node.opacity = 0;

            cc.tween(this.node)
                .to(0.3, { opacity: 255 }, { easing: 'smooth' })
                .start();
        } else {
            this.node.opacity = 255;

            cc.tween(this.node)
                .to(0.3, { opacity: 0 }, { easing: 'smooth' })
                .call(() => {
                    this.node.active = status;
                })
                .start();
        }
    }
}
