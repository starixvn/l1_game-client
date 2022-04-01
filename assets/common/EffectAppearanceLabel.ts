const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectAppearanceLabel extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.RichText)
    richText: cc.RichText = null;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property
    speed = 400;

    set string(value: string) {
        this.label && (this.label.string = value);
        this.richText && (this.richText.string = value);
        if (value.length > 0) {
            this.playAnimation();
        }
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

        const width = this.calculateDistance();
        const duration = width / this.speed;
        cc.tween(this.mask.node).to(duration, { width: width }).start();
    }
}
