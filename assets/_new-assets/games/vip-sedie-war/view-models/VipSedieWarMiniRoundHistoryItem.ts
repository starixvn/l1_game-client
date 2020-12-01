import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWarMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    red: cc.Label = null;

    @property({ type: cc.SpriteFrame })
    dotsFrame: cc.SpriteFrame[] = [];

    public setData(data: any) {
        this.data = data;
        const red = data.red;
        this.icon.spriteFrame = this.dotsFrame[data.type];
        this.red.string = red;
    }
}
