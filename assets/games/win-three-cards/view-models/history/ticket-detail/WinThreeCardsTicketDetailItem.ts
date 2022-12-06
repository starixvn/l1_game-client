import { formatDateTime } from "../../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../../common/helpers/NumberHelper";
import { WinThreeCardsBetLogDetail, WinThreeCardsOdds, WinThreeCardsSettlementResult } from "../WinThreeCardsHistory";

const { ccclass, property } = cc._decorator;
@ccclass
export default class WinThreeCardsTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;   

    @property(cc.Node)
    bgRow: cc.Node = null;

    height: number = null;

    updateContent(
        betLogDetail: WinThreeCardsBetLogDetail,
        odds: WinThreeCardsOdds,
        settlementResult: WinThreeCardsSettlementResult,
        symbolsSpriteFrames: cc.SpriteFrame[],
        index: number
    ) {
        this.bgRow.active = index % 2 === 1;
        const { time, choice, amount } = betLogDetail;
        const winColor = new cc.Color(255, 246, 100);
        this.time.string = formatDateTime(time);
       
        const winningChoice = this.getWinningChoice(choice, settlementResult);
        this.odd.string = odds[winningChoice];
        this.amount.string = numberWithCommas(amount);

        const winningAmount = settlementResult[winningChoice] ? amount * odds[winningChoice] : 0;
        this.win.string = numberWithCommas(winningAmount, 2);
        this.win.node.color = winningAmount > 0 ? winColor : cc.Color.WHITE;

        if (index === 0) {
            this.node.getChildByName("topBorder").active = false;
        }

        this.height = this.node.height;
    }

    private getWinningChoice(mainChoice: string, settlementResult: WinThreeCardsSettlementResult) {
        let choice = mainChoice;        
        return choice;
    }    
}
