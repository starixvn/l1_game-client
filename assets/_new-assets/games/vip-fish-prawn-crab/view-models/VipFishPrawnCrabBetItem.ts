import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabBetItem extends BetItem {

    @property(cc.Sprite)
    xSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    x2SpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x3SpriteFrame: cc.SpriteFrame = null;

    setXValue(x) {
        this.xSprite.node.active = true;
        this.xSprite.spriteFrame = x == 2 ? this.x2SpriteFrame : this.x3SpriteFrame;
    }
}