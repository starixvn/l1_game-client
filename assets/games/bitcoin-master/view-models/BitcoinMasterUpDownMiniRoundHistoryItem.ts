import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    downDot: cc.SpriteFrame = null;

    protected readonly betTypes = ["up", "down"];

    public setData(data: any) {
        this.data = data;
        this.icon.spriteFrame = data.settlementResult[this.betTypes[0]] ? this.upDot : this.downDot;
    }
}
