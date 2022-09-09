import BlinkNode from "../../../common/BlinkNode";
import { FruitSlotRoundHistory } from "../event-handlers/FruitSlotRoundHistoryHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotMiniRoundHistoryItem extends cc.Component {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    symbol: cc.Sprite = null;

    @property(cc.Node)
    bigSmall: cc.Node = null;

    public setData(data: FruitSlotRoundHistory, isBlink = false) {
        if (data === null) {
            this.symbol.spriteFrame = null;
            this.bigSmall.active = false;
            // next
            if (isBlink) {
                // binkbink
            }
            return;
        }
        const { result, settlementResult } = data;
        this.symbol.spriteFrame = this.atlas.getSpriteFrame(`item_${result.symbols[0]}`);
        const bigSmallColor = settlementResult.big ? "#fe3a0c" : "#00e5ff";
        this.bigSmall.active = true;
        const color = cc.Color.WHITE;
        this.bigSmall.color = color.fromHEX(bigSmallColor);
    }
}
