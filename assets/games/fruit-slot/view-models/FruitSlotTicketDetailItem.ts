import { formatDateTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class FruitSlotTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property({ type: cc.Sprite })
    symbol: cc.Sprite = null;

    @property(cc.Node)
    bigSymbol: cc.Node = null;

    @property(cc.Node)
    smallSymbol: cc.Node = null;

    height: number = null;

    updateContent(log: any, odds: any, settlementResult: any, symbolsSpriteFrames: cc.SpriteFrame[]) {
        this.time.string = formatDateTime(log.time);

        if (["big", "small"].includes(log.choice)) {
            this.symbol.node.active = false;
            const isBigChoice = log.choice === "big";
            this.bigSymbol.active = isBigChoice;
            this.smallSymbol.active = !isBigChoice;
        } else {
            this.symbol.spriteFrame = symbolsSpriteFrames.find((sprite) => sprite.name === `item_${log.choice}`);
            this.bigSymbol.active = false;
            this.smallSymbol.active = false;
        }

        this.odd.string = odds[log.choice];
        this.amount.string = numberWithCommas(log.amount);

        const winningAmount = settlementResult[log.choice] ? log.amount * odds[log.choice] : 0;
        this.win.string = numberWithCommas(winningAmount);
        this.win.node.color = winningAmount > 0 ? cc.Color.YELLOW : cc.Color.WHITE;

        this.height = this.node.height;
    }
}
