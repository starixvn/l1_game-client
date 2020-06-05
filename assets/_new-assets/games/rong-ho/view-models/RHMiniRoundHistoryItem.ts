import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";
import RongHo from "./RongHo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RHMiniRoundHistoryItem extends MiniRoundHistoryItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property({ type: cc.SpriteFrame })
    itemSprites: cc.SpriteFrame[] = [];

    public setData(data: any) {
        this.data = data;

        const winChoice = RongHo.getWinItem(data.result);
        this.icon.spriteFrame = this.itemSprites[winChoice];
    }
}
