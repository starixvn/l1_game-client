import * as _ from "lodash";

import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";

export default class BlackJackIngameHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.ingame) {
        }
        return true;
    }

    processIngame(ingame: any) {
        if (_.isEmpty(ingame)) {
            this.main.newGame();
        } else {
            const dealerCards = ingame.dealer;
            dealerCards.forEach(card => {
                const cardNode = this.main.createCard(card);
                this.main.dealerHand.addCard(cardNode);
            });

            const hands = ingame.hands;
            hands.forEach(hand => {
                const place = this.main.handPlaces[hand.pos - 1];
                place.setData(hand);
                hands.cards.forEach(card => {
                    const cardNode = this.main.createCard(card);
                    place.addCard(cardNode);
                });
                place.updateDisplayBetValue(hand.bet);
                place.updateDisplayStatus(hand.total);
            });

            this.main.switchToNextHand();
        }
    }
}