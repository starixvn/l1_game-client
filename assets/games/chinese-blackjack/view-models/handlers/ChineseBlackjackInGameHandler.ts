import BlackJackIngameHandler from "../../../blackjack/view-models/handlers/BlackJackIngameHandler";

export default class ChineseBlackjackInGameHandler extends BlackJackIngameHandler {
    createDealerCards(dealerCards) {
        if (!dealerCards.length) {
            this.createFaceDownCards(2);
            this.main.dealerHand.cardLayout.updateLayout();
        }
    }
}
