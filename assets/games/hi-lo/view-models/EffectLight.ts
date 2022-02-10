const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectLight extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property(cc.Node)
    decorator: cc.Node = null;

    @property
    speed = 400;

    playAnimation() {
        this.mask.node.width = 0;
        this.decorator.opacity = 255;
        this.decorator.position = cc.v3(0, this.decorator.position.y, this.decorator.position.z);

        const padding = 20;
        const width = this.background.width + padding;
        const duration = width / this.speed;

        this.decorator.stopAllActions();
        cc.tween(this.mask.node).to(duration, { width: width }).start();
        cc.tween(this.decorator)
            .to(duration, { position: cc.v3(width, this.decorator.position.y, this.decorator.position.z) })
            .to(0.1, { opacity: 0 })
            .start();
    }
}
