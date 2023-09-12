import NewButton from "./NewButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FadeEffectButton extends cc.Component {
    setActive(status = true) {
        this.node.stopAllActions();
        const disabledLayer = this.node.getChildByName("disable-layer");
        disabledLayer.active = !status;

        if (status) {
            this.node.active = status;
            this.node.getComponent(NewButton).collider.getComponent(cc.PolygonCollider).enabled = true;
        } else {
            this.node.getComponent(NewButton).collider.getComponent(cc.PolygonCollider).enabled = false;
            this.node.active = status;
        }
    }

    async setDisabled(status) {
        this.node.active = true;
        this.node.getComponent(NewButton).collider.getComponent(cc.PolygonCollider).enabled = true;
        const disabledLayer = this.node.getChildByName("disable-layer");
        disabledLayer.active = status;
    }
}
