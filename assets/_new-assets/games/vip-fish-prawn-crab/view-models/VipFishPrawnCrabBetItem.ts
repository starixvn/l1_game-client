import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabBetItem extends BetItem {

    @property(cc.Sprite)
    xSprite: cc.Sprite = null;

    setXSpriteFrame(spriteFrame: cc.SpriteFrame, opacity: boolean = true) {
        this.xSprite.node.active = true;
        this.xSprite.spriteFrame = spriteFrame;
        if (!opacity) {
            this.xSprite.node.opacity = 100;
        }
    }

    public resetHighlight() {
        super.resetHighlight();
        if (this.xSprite) {
            this.xSprite.node.active = false;
        }
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        super.setHighlightItems(highlight, isAnimated);
        if (this.highlightBackground.active) {
            this.highlightBorder.active = false;
        }

        cc.tween(this.highlightBackground)
            .repeatForever(
                cc.tween()
                    .to(0.2, { opacity: 100 }, { easing: "cubicInOut" })
                    .to(0.2, { opacity: 255 }, { easing: "cubicInOut" })
            )
            .start();
    }
}