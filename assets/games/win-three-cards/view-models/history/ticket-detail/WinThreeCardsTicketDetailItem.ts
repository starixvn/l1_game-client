import { i18n } from "../../../../../ClientModules";
import { formatDateTime } from "../../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../../common/helpers/NumberHelper";
import { WinThreeCardsBetLogDetails, WinThreeCardsOdds, WinThreeCardsSettlementResult } from "../../models/WinThreeCardsModel";

const { ccclass, property } = cc._decorator;
@ccclass
export default class WinThreeCardsTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    updateContent(
        freeBet: boolean,
        betLogDetail: WinThreeCardsBetLogDetails,
        odds: WinThreeCardsOdds,
        settlementResult: WinThreeCardsSettlementResult,
        index: number
    ) {
        const choiceNames = {
            dragon: i18n.t("winThreeCards.dragon"),
            phoenix: i18n.t("winThreeCards.phoenix"),
            pair8Plus: i18n.t("winThreeCards.pair8Plus"),
            threeOfAKind: i18n.t("winThreeCards.threeOfAKind"),
            straightFlush: i18n.t("winThreeCards.straightFlush"),
            flush: i18n.t("winThreeCards.flush"),
            straight: i18n.t("winThreeCards.straight")
        };

        this.bgRow.active = index % 2 === 1;
        const { time, choice, amount } = betLogDetail;
        const winColor = new cc.Color(255, 246, 100);
        this.time.string = formatDateTime(time);
        this.choice.string = choiceNames[choice];
        this.odd.string = odds[choice];
        this.amount.string = numberWithCommas(amount);

        const effectiveOdds = freeBet ? odds[choice] - 1 : odds[choice];
        const winningAmount = this.getWinAmount(settlementResult[choice], amount, effectiveOdds, settlementResult.tie);
        this.win.string = numberWithCommas(winningAmount, 2);
        this.win.node.color = winningAmount > 0 ? winColor : cc.Color.WHITE;

        if (index === 0) {
            this.node.getChildByName("topBorder").active = false;
        }
    }

    private getWinAmount(isWinning: boolean, amount: number, effectiveOdds: number, isTie = false) {
        if (isTie) {
            return amount;
        }

        return isWinning ? amount * effectiveOdds : 0;
    }
}
