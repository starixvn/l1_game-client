import TexasTicketDetailModel from "./../../event-models/texas-ticket-detail-model";
import HoldemPokerTicketDetail from "../../../holdem-poker/view-models/history/HoldemPokerTicketDetail";
import TexasTicketDetailItem from "./texas-ticket-detail-item";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasTicketDetail extends HoldemPokerTicketDetail {
    renderBets(data: TexasTicketDetailModel) {
        super.renderBets(data);
    }

    renderCards(data: TexasTicketDetailModel) {
        super.renderCards(data);
    }

    protected getComponentDetailItem(node: cc.Node): TexasTicketDetailItem {
        return node.getComponent(TexasTicketDetailItem);
    }
}
