import NewCard, { CardAnimation, CardModel } from "../../../../common/new-card/view-models/NewCard";
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
        let delaytime = 1;

        if (!isBlackJack) {
            const checkDuration = 1.5;

            this.main.dealerHand.cardLayout.content.children.forEach((child) => {
                child.getComponent(NewCard).playAnimation(CardAnimation.DealerCheckBlackJackFail, checkDuration);
            });

            delaytime += checkDuration;
        }

        this.main.disabledInRoundAction(true);

        cc.tween(this.main)
            .delay(delaytime)
            .call(() => {
                this.main.startRound();
            })
            .start();
    }
}
