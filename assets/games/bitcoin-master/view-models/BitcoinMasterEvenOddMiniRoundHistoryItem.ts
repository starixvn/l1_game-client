import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";
import { BMBetType } from "./BitcoinMasterCommon";
import BitcoinMasterUtils from "./BitcoinMasterUtils";

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

    public setData(data: any) {
        this.data = data;
        this.icon.spriteFrame = data.settlementResult[BMBetType.Even] ? this.whiteDot : this.redDot;

        const color = cc.Color.WHITE;
        this.number.string = BitcoinMasterUtils.getEvenOddResult(data.result.close);
        this.number.node.color = data.settlementResult[BMBetType.Even] ? color.fromHEX("#3c3939") : color;
    }
}
