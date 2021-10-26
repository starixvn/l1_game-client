import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterEvenOddMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    redDot: cc.SpriteFrame = null;

    @property(cc.Label)
    number: cc.Label = null;

    protected readonly betTypes = ["even", "odd"];

    public setData(data: any) {
        this.data = data;
        this.icon.spriteFrame = data.settlementResult[this.betTypes[0]] ? this.whiteDot : this.redDot;
    }
}
