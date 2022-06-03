import CascadingSlotSpinButton from "../../cascading-slot/view-models/CascadingSlotSpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreasureIslandSpinButton extends CascadingSlotSpinButton {
    @property(cc.Sprite)
    spinButtonSprite: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    showAutoSpinMode() {
        super.showAutoSpinMode();
        this.spinButtonSprite.spriteFrame = this.mainAtlas.getSpriteFrame("spin-button-autospin");
    }

    showNormalMode() {
        super.showNormalMode();
        this.spinButtonSprite.spriteFrame = this.mainAtlas.getSpriteFrame("spin-button");
    }
}
