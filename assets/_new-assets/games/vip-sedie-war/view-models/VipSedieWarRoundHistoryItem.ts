import SedieRoundHistoryItem from "../../mini-sedie/viewModels/SedieRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWarRoundHistoryItem extends SedieRoundHistoryItem {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    public setValue(value: number) {
        if (!this.sprite || !this.atlas) {
            return;
        }

        const spriteName = `stats_chip${value}`;
        this.sprite.spriteFrame = this.atlas.getSpriteFrame(spriteName);
    }
}
