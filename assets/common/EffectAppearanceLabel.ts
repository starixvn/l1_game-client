const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectAppearanceLabel extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.RichText)
    richText: cc.RichText = null;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property(cc.Node)
    decorator: cc.Node = null;

    @property
    speed = 400;

    set string(value: string) {
        this.label && (this.label.string = value);
        this.richText && (this.richText.string = value);
        if (value.length > 0) {
            this.playAnimation();
        }
    }

    onLoad() {
        this.decorator.opacity = 0;
    }

    protected getContentWidth(): number {
        return this.label ? this.label.node.width : this.richText ? this.richText.node.width * this.richText.node.scaleX : 0;
    }

    protected calculateDistance(): number {
        const padding = 20;
        return this.getContentWidth() + padding;
    }

    public playAnimation() {
        this.mask.node.width = 0;
        this.decorator.opacity = 255;
        this.decorator.position = cc.v3(0, this.decorator.position.y, this.decorator.position.z);

        const width = this.calculateDistance();
        const duration = width / this.speed;

        this.decorator.stopAllActions();
        cc.tween(this.mask.node).to(duration, { width: width }).start();
        cc.tween(this.decorator)
            .to(duration, { position: cc.v3(width, this.decorator.position.y, this.decorator.position.z) })
            .to(0.1, { opacity: 0 })
            .start();
    }
}
