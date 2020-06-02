import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";
import RongHo from "./RongHo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RHMiniRoundHistoryTip extends MiniRoundHistoryTip {

    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    dragon: cc.Label = null;

    @property(cc.Sprite)
    dragonType: cc.Sprite = null;

    @property(cc.Label)
    tiger: cc.Label = null;

    @property(cc.Sprite)
    tigerType: cc.Sprite = null;

    @property({ type: cc.SpriteFrame })
    cardTypeSprite: cc.SpriteFrame[] = [];

    public setData(data: { card: number, type: number }[]) {
        const winChoice = RongHo.getWinItem(data);
        const choiceNames = ["RỒNG", "HỔ", "HÒA"];

        this.result.string = choiceNames[winChoice];

        this.dragon.string = data[0].card.toString();
        this.dragonType.spriteFrame = this.cardTypeSprite[data[0].type];
        this.tiger.string = data[1].card.toString();
        this.tigerType.spriteFrame = this.cardTypeSprite[data[1].type];
    }
}
