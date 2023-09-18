import NewCard, { CardModel } from "../../../../common/new-card/view-models/NewCard";
import DealHandler, { DrawCardAction } from "../../../blackjack/view-models/handlers/DealHandler";

export default class PontoonDealHandler extends DealHandler {
    drawFirstDealerCard(dealerCards: CardModel[], actions: DrawCardAction[]) {
        actions.push(() => {
            this.main.drawingCardToDealer(null, true);
        });
    }

    drawSecondDealerCardWithNormalCase(dealerCards: CardModel[], actions: DrawCardAction[]) {
        actions.push(() => {
            this.main.drawingCardToDealer(null, true, () => {});
        });
    }

    playAnimationDealerCheck(dealerCards: CardModel[], isBlackJack: boolean) {
        this.main.startRound();
    }
}
