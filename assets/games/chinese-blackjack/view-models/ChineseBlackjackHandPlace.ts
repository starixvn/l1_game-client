import { CardModel } from "../../../common/new-card/view-models/NewCard";
import HandPlace from "../../blackjack/view-models/HandPlace";
import ChineseBlackjackUtils from "./ChineseBlackjackUtils";

const { ccclass, property, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
export default class ChineseBlackjackHandPlace extends HandPlace {
    @property(cc.Node)
    fiveCardsNode: cc.Node = null;

    @property(cc.Node)
    banBanNode: cc.Node = null;

    resetView() {
        super.resetView();
        this.fiveCardsNode.active = false;
    }

    showExtraInfoHandPlace(cards: CardModel[], total: number) {
        if (total > 21) {
            this.handleExtraInfoDisplay(this.burstNode);
            return;
        }

        if (ChineseBlackjackUtils.isBanLuck(cards)) {
            this.handleExtraInfoDisplay(this.blackJackNode);
            return;
        }

        if (ChineseBlackjackUtils.isBanBan(cards)) {
            this.handleExtraInfoDisplay(this.banBanNode);
            return;
        }

        if (this.isFiveCards(cards, total)) {
            this.handleExtraInfoDisplay(this.fiveCardsNode);
        }
    }

    private handleExtraInfoDisplay(node: cc.Node) {
        node.active = true;
        this.showScore(false);
    }

    isFiveCards(cards: CardModel[], total: number) {
        return total <= 21 && cards.length === 5;
    }

    isBlackJackHandPlace(cards: CardModel[], total: number): boolean {
        return total === 21 && cards.length === 2;
    }

    showExtraInfoDealerPlace(cards: CardModel[], total: number) {
        this.showExtraInfoHandPlace(cards, total);
    }
}
