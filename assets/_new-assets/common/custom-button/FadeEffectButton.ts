import NewButton from "./NewButton";

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
            this.node.getComponent(NewButton).collider.getComponent(cc.PolygonCollider).enabled = true;
            this.node.opacity = 0;

            cc.tween(this.node)
                .to(0.3, { opacity: 255 }, { easing: 'sineOut' })
                .start();
        } else {
            this.node.opacity = 255;
            this.node.getComponent(NewButton).collider.getComponent(cc.PolygonCollider).enabled = false;
            cc.tween(this.node)
                .to(0.3, { opacity: 0 }, { easing: 'sineIn' })
                .call(() => {
                    this.node.active = status;
                })
                .start();
        }
    }
}
