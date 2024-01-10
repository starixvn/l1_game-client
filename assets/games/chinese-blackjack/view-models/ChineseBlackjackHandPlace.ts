import { CardModel } from "../../../common/new-card/view-models/NewCard";
import BlackJackUtils from "../../blackjack/view-models/BlackJackUtils";
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

    @property(cc.Node)
    unqualifiedNode: cc.Node = null;

    resetView() {
        super.resetView();
        this.fiveCardsNode.active = false;
        this.banBanNode.active = false;
        this.unqualifiedNode.active = false;
    }

    updateDisplayScore(final: boolean) {
        if (!this.data) {
            this.scoreValue.string = "";
            this.showScore(false);
            return;
        }
        this.showScore(true);
        if (final) {
            if (this.data.isStand) {
                const scoreValue = Math.max(...this.data.total);
                this.scoreValue.string = scoreValue.toString();
                this.showExtraInfo(this.data.cards, scoreValue, this.data.actions);
            } else {
                this.scoreValue.string = this.data.total.join(" / ");
            }
        } else {
            const card = this.data.cards[0];
            const values = BlackJackUtils.getValues(card.rank);
            this.scoreValue.string = values.join(" / ");
        }
    }

    showExtraInfo(cards: CardModel[], total: number, actions: string[]) {
        if (total > 21) {
            this.handleExtraInfoDisplay(this?.burstNode);
            return;
        }

        if (total < 16 && ChineseBlackjackUtils.hasStandAction(actions)) {
            this.handleExtraInfoDisplay(this?.unqualifiedNode);
            return;
        }

        if (ChineseBlackjackUtils.isBanLuck(cards)) {
            this.handleExtraInfoDisplay(this?.blackJackNode);
            return;
        }

        if (ChineseBlackjackUtils.isBanBan(cards)) {
            this.handleExtraInfoDisplay(this?.banBanNode);
            return;
        }

        if (this.isFiveCards(cards, total)) {
            this.handleExtraInfoDisplay(this?.fiveCardsNode);
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
