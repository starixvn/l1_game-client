import { getNameCard } from "../../../common/helpers/CardHelper";
import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";
import RongHo from "./RongHo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RHMiniRoundHistoryTip extends MiniRoundHistoryTip {
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

    public setData(data: any) {
        const cards = data.result;
        const winChoice = RongHo.getWinItem(cards);
        const choiceNames = ["RỒNG", "HỔ", "HÒA"];
        const choiceColors = [
            new cc.Color(219, 185, 0), // cc.Color.YELLOW, // new cc.Color(255, 224, 58),
            cc.Color.RED, // new cc.Color(255, 125, 124),
            new cc.Color(63, 111, 123)
        ];

        this.roundId.string = `#${data.round}`;
        this.result.string = choiceNames[winChoice];
        this.result.node.color = choiceColors[winChoice];

        this.dragon.string = getNameCard(cards[0].card);
        this.dragonType.spriteFrame = this.cardTypeSprite[cards[0].type];
        this.tiger.string = getNameCard(cards[1].card);
        this.tigerType.spriteFrame = this.cardTypeSprite[cards[1].type];
    }
}
