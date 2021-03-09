import BetItem from "../../_base/view-models/BetItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCuaBetItem extends BetItem {
    @property(cc.Sprite)
    xSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    x2Sprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x3Sprite: cc.SpriteFrame = null;

    public resetHighlight() {
        super.resetHighlight();
        if (this.xSprite) {
            this.xSprite.node.active = false;
        }
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        if (!isAnimated) {
            this.highlight.active = true;
        } else {
            this.highlight.active = !highlight && isAnimated;
        }

        if (this.highlightBackground) {
            this.highlightBackground.active = highlight && isAnimated;
        }

        if (this.highlightBorder) {
            this.highlightBorder.active = highlight && !isAnimated;
        }

        if (this.normalBorder) {
            this.normalBorder.active = highlight;
        }
    }

    setXSpriteFrame(spriteFrame: cc.SpriteFrame) {
        this.xSprite.node.active = true;
        this.xSprite.spriteFrame = spriteFrame;
    }
}
