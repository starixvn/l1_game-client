import { CombineCardResultLabel } from "./../../../holdem-poker/components/cards/view-models/HoldemPokerCards";
import HoldemPokerTicketDetail from "../../../holdem-poker/view-models/history/HoldemPokerTicketDetail";
import TexasTicketDetailItem from "./texas-ticket-detail-item";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasTicketDetail extends HoldemPokerTicketDetail {
    protected getComponentDetailItem(node: cc.Node): TexasTicketDetailItem {
        return node.getComponent(TexasTicketDetailItem);
    }

    getDealerResult(dealerCards) {
        return `holdEmPoker.${CombineCardResultLabel[dealerCards.handResultId].dataId}`;
    }

    protected checkFaceDownPlayerCard(isSwappedOrHold) {
        return isSwappedOrHold;
    }
}
