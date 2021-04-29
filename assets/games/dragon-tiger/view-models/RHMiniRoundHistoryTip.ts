import { getNameCard } from '../../../common/helpers/CardHelper';
import MiniRoundHistoryTip from '../../../common/mini-round-history/MiniRoundHistoryTip';
import RongHo from './RongHo';

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
        const result = data.result;
        const winChoice = RongHo.getWinItem(data.settlementResult);
        const choiceNames = ["RỒNG", "HỔ", "HÒA"];
        const choiceColors = [new cc.Color(219, 185, 0), cc.Color.RED, new cc.Color(63, 111, 123)];

        this.roundId.string = `#${data.roundId}`;
        this.result.string = choiceNames[winChoice];
        this.result.node.color = choiceColors[winChoice];

        const dragon = result.dragon;
        const tiger = result.tiger;
        this.dragon.string = getNameCard(dragon.card);
        this.dragonType.spriteFrame = this.cardTypeSprite[dragon.type];
        this.tiger.string = getNameCard(tiger.card);
        this.tigerType.spriteFrame = this.cardTypeSprite[tiger.type];
    }
}
