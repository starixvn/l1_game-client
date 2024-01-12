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
        if (ChineseBlackjackUtils.isFiveCards(cards, total)) {
            this.handleExtraInfoDisplay(this?.fiveCardsNode);
            return;
        }

        if (total > 21) {
            this.handleExtraInfoDisplay(this?.burstNode);
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

        if (ChineseBlackjackUtils.isUnqualified(cards, total) && ChineseBlackjackUtils.hasStandAction(actions)) {
            this.handleExtraInfoDisplay(this?.unqualifiedNode);
        }
    }

    private handleExtraInfoDisplay(node: cc.Node) {
        node.active = true;
        this.showScore(false);
    }

    isBlackJackHandPlace(cards: CardModel[], total: number): boolean {
        return total === 21 && cards.length === 2;
    }

    showExtraInfoDealerPlace(cards: CardModel[], total: number) {
        this.showExtraInfoHandPlace(cards, total);
    }

    showScoreWithOutData(cards: CardModel[], cardNum: number, final = false) {
        this.showScore(true);
        const values = BlackJackUtils.getTotal(cards, cardNum);
        if (final) {
            const total = values[values.length - 1];
            this.scoreValue.string = total.toString();
            this.showExtraInfo(cards, total, []);
        } else {
            this.scoreValue.string = values.join(" / ");
        }
    }
}
