import BetItem from "../../_base/view-models/BetItem";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCuaBetItem extends BetItem {
    @property(cc.Sprite)
    xSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    x2Sprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x3Sprite: cc.SpriteFrame = null;

    // totallCuoc(cuoc) {
    //     this.total.string = cuoc > 0 ? numberWithCommas(cuoc) : "";
    // }
    // select(x) {
    //     this.xSprite.node.active = x !== 1;
    //     this.xSprite.spriteFrame = x === 2 ? this.x2Sprite : this.x3Sprite;
    // }

    // unSelect() {
    //     this.xSprite.node.active = false;
    // }

    public resetHighlight() {
        super.resetHighlight();
        if (this.xSprite) {
            this.xSprite.node.active = false;
        }
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        this.highlight.active = !highlight && isAnimated;
        if (this.highlightBackground) {
            this.highlightBackground.active = !highlight && isAnimated;
        }

        if (this.highlightBorder) {
            this.highlightBorder.active = !highlight && !isAnimated;
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
