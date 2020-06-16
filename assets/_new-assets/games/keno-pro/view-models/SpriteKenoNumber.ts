import KenoNumber from "./KenoNumber";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteKenoNumber extends KenoNumber {

    @property({ type: cc.Label, visible: false, override: true })
    numberLabel: cc.Label = null;

    @property(cc.Sprite)
    numberSprite: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    setNumber(value: number, animated: boolean) {
        this.animated = animated;
        this.numberSprite.spriteFrame = this.atlas.getSpriteFrame(value.toString());
        this.show(true);
    }
}
