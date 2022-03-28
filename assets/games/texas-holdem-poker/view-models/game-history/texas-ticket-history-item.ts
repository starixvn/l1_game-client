import { BetLog, HandResultConst } from "../../../holdem-poker/view-models/history/HoldemPokerTicketHistory";
import HoldemPokerTicketHistoryItem from "../../../holdem-poker/view-models/history/HoldemPokerTicketHistoryItem";

const { ccclass } = cc._decorator;
@ccclass
export default class TexasTicketHistoryItem extends HoldemPokerTicketHistoryItem {
    handleDealerResult(log: BetLog) {
        const dealerResult = `holdEmPoker.${HandResultConst[log.dealerHandId]}`;
        if (log.isPlayerWin > 0) {
            this.player.node.color = cc.Color.YELLOW;
        } else if (log.isPlayerWin < 0) {
            this.dealer.node.color = cc.Color.YELLOW;
        }
        return dealerResult;
    }
}
