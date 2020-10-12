const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteNumber extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    winning: cc.Node = null;

    private originFrame: cc.SpriteFrame;

    onLoad() {
        if (this.winning) {
            this.originFrame = this.winning.getComponent(cc.Sprite).spriteFrame;
        }
        this.clearHighlight();
        this.hideWinning();
    }

    public clearHighlight() {
        this.highlight.stopAllActions();
        this.highlight.runAction(cc.fadeOut(0.1));
    }

    public showHighlight() {
        this.highlight.stopAllActions();
        this.highlight.runAction(cc.fadeIn(0.11));
    }

    public showWinning(animated: boolean) {
        this.winning && (this.winning.active = animated);

        const sprite = this.winning.getComponent(cc.Sprite);
        sprite.spriteFrame = this.originFrame;
        if (animated) {
            // sprite.spriteFrame = this.highlight.getComponent(cc.Sprite).spriteFrame;
            const sequence = cc.sequence(
                cc.fadeOut(.2),
                cc.fadeIn(.2),
            );
            this.winning.runAction(cc.sequence(
                cc.repeat(sequence, 14),
                cc.fadeOut(.2),
                cc.callFunc(() => {
                    sprite.spriteFrame = this.originFrame;
                })
            ));
        }
    }

    public hideWinning() {
        this.winning && (this.winning.active = false);
    }
}
