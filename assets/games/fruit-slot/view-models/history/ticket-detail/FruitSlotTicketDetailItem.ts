import { formatDateTime } from "../../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../../common/helpers/NumberHelper";
import { FruitSlotBetLogDetail, FruitSlotOdds, FruitSlotSettlementResult } from "../FruitSlotHistory";

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

    updateContent(
        betLogDetail: FruitSlotBetLogDetail,
        odds: FruitSlotOdds,
        settlementResult: FruitSlotSettlementResult,
        symbolsSpriteFrames: cc.SpriteFrame[],
        index: number
    ) {
        const { time, choice, amount } = betLogDetail;
        this.time.string = formatDateTime(time);

        ["big", "small"].includes(choice) ? this.updateBigSmallSymbol(choice) : this.updateNormalSymbol(symbolsSpriteFrames, choice);

        this.odd.string = odds[choice];
        this.amount.string = numberWithCommas(amount);

        const winningAmount = settlementResult[choice] ? amount * odds[choice] : 0;
        this.win.string = numberWithCommas(winningAmount);
        this.win.node.color = winningAmount > 0 ? cc.Color.YELLOW : cc.Color.WHITE;

        if (index === 0) {
            this.node.getChildByName("topBorder").active = false;
        }

        this.height = this.node.height;
    }

    private updateBigSmallSymbol(choice: string) {
        this.symbol.node.active = false;
        const isBigChoice = choice === "big";
        this.bigSymbol.active = isBigChoice;
        this.smallSymbol.active = !isBigChoice;
    }

    private updateNormalSymbol(symbolsSpriteFrames: cc.SpriteFrame[], choice: string) {
        this.symbol.spriteFrame = symbolsSpriteFrames.find((sprite) => sprite.name === `item_${choice}`);
        this.bigSymbol.active = false;
        this.smallSymbol.active = false;
    }
}
