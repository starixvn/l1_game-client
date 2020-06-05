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
        switch (value) {
            case 1:
            case 3:
                spriteName = `chip_do_${value}`;
                break;
            case 0:
            case 2:
            case 4:
                spriteName = `chip_trang_${value}`;
                break;
        }
        this.sprite.spriteFrame = this.atlas.getSpriteFrame(spriteName);
    }
}
