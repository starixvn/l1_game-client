import MiniRoundHistoryItem from '../../../common/mini-round-history/MiniRoundHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    blackDot: cc.SpriteFrame = null;

    public setData(data: any) {
        const point = data.dice[0] + data.dice[1] + data.dice[2];
        this.icon.spriteFrame = point < 11 ? this.whiteDot : this.blackDot;
    }
}
