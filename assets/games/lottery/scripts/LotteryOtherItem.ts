import { LotteryChoiceItem } from "./LotteryChoiceItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryOtherItem extends LotteryChoiceItem {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;
    @property(cc.Sprite)
    nameSprite: cc.Sprite = null;

    setStats(number: number) {
        this.statsLabel.string = number.toString();
    }

    setName(key: string) {
        this.node.name = key;
        this.nameSprite.spriteFrame = this.atlas.getSpriteFrame(`txt_${key}`);
    }
}
