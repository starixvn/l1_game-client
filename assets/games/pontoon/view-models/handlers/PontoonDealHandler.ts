import NewCard, { CardAnimation, CardModel } from "../../../../common/new-card/view-models/NewCard";
import { BlackJackActionType } from "../../../blackjack/view-models/BlackJack";
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

    drawSecondDealerCardWithBlackJack(dealerCards: CardModel[], actions: DrawCardAction[]) {
        actions.push(() => {
            this.main.drawingCardToDealer(null, true, () => {});
        });
    }

    playAnimationDealerCheck(dealerCards: CardModel[], isBlackJack: boolean) {
        let delaytime = 1;
        const checkDuration = 1.5;
        this.main.dealerHand.cardLayout.content.children.forEach((child) => {
            child.getComponent(NewCard).playAnimation(CardAnimation.DealerCheckBlackJackFail, checkDuration);
        });

        delaytime += checkDuration;

        isBlackJack ? this.main.inRoundActionVisibility(false) : this.main.disabledInRoundAction(true);

        cc.tween(this.main)
            .delay(delaytime)
            .call(() => {
                this.main.startRound();
                !isBlackJack && this.main.showActionsWithBehavior(BlackJackActionType.IN_ROUND);
            })
            .start();
    }
}
