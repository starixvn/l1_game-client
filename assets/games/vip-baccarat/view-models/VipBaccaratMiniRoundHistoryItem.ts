import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipBaccaratMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotBlue: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotGreen: cc.SpriteFrame = null;

    public setData(data: any) {
        this.data = data;
        const result = data.result;
        if (result.tie) {
            this.icon.spriteFrame = this.dotGreen;
        } else {
            this.icon.spriteFrame = result.banker ? this.dotRed : this.dotBlue;
        }
    }
}
