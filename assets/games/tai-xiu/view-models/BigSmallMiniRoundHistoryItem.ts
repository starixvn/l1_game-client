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
        this.data = data;

        const point = data.result.dice1 + data.result.dice2 + data.result.dice3;
        this.icon.spriteFrame = point < 11 ? this.whiteDot : this.blackDot;
    }
}
