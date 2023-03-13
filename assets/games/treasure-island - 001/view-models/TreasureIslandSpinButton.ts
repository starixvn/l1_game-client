import CascadingSlotSpinButton from "../../cascading-slot/view-models/CascadingSlotSpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreasureIslandSpinButton extends CascadingSlotSpinButton {
    @property(cc.Sprite)
    spinButtonSprite: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    override showAutoSpinMode() {}

    override showNormalMode() {
        super.showNormalMode();
        this.spinButtonSprite.spriteFrame = this.mainAtlas.getSpriteFrame("spin-button");
    }
}
