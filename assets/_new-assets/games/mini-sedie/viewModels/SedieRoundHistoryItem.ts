const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundHistoryItem extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    public setValue(value: number) {
        if (!this.sprite || !this.atlas) {
            return;
        }

        let spriteName = "chip_trang_0";
        if (value % 2) {
            spriteName = `chip_do_${value}`;
        } else {
            spriteName = `chip_trang_${value}`;
        }
        this.sprite.spriteFrame = this.atlas.getSpriteFrame(spriteName);
    }
}
