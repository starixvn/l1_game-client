import TexasTicketDetailModel from "./../../event-models/texas-ticket-detail-model";
import HoldemPokerTicketDetail from "../../../holdem-poker/view-models/history/HoldemPokerTicketDetail";
import TexasTicketDetailItem from "./texas-ticket-detail-item";
import { CombineCardResultLabel } from "../../../holdem-poker/components/cards/view-models/HoldemPokerCards";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasTicketDetail extends HoldemPokerTicketDetail {
    renderBets(data: TexasTicketDetailModel) {
        super.renderBets(data);
    }

    renderCards(data: TexasTicketDetailModel) {
        super.renderCards(data);
    }
    protected renderDealerRank(dealerCards: any, isPlayerWin: number) {
        const dealerResult = `holdEmPoker.${CombineCardResultLabel[dealerCards.handResultId].dataId}`;
        if (isPlayerWin > 0) {
            this.playerRank.node.color = cc.Color.YELLOW;
        } else if (isPlayerWin < 0) {
            this.dealerRank.node.color = cc.Color.YELLOW;
        }

        return dealerResult;
    }

    protected getComponentDetailItem(node: cc.Node): TexasTicketDetailItem {
        return node.getComponent(TexasTicketDetailItem);
    }

    protected checkFaceDownPlayerCard(isSwappedOrHold) {
        return isSwappedOrHold;
    }
}
