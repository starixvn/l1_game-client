import NewButton from "./NewButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FadeEffectButton extends cc.Component {
    @property(cc.Node)
    disabledLayer: cc.Node = null;

    setActive(status = true) {
        this.node.stopAllActions();

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
        this.node.getComponent(NewButton).collider.getComponent(cc.PolygonCollider).enabled = !status;
        this.disabledLayer && (this.disabledLayer.active = status);
    }
}
