import * as _ from "lodash";

import NewCard from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";

export default class BlackJackIngameHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.ownBets) {
            this.processIngame(data.ownBets);
        }
        return true;
    }

    processIngame(ownBets: any) {
        if (_.isEmpty(ownBets)) {
            this.main.newGame();
        } else {
            const dealerCards = ownBets.dealer;
            dealerCards.forEach(card => {
                const cardNode = this.main.createCard(card);
                this.main.dealerHand.addCard(cardNode);

                const cardComponent = cardNode.getComponent(NewCard);
                cardComponent.faceUp();
            });

            if (dealerCards.length < 2) {
                const cardNode = this.main.createCard(null);
                const cardComponent = cardNode.getComponent(NewCard);
                cardComponent.faceDown();
                this.main.dealerHand.addCard(cardNode);
                this.main.dealerHand.cardLayout.updateLayout();
            }

            const hands = ownBets.hands;
            hands.forEach(hand => {
                const pos = hand.pos - 1;
                const place = this.main.handPlaces[pos];
                place.setData(hand);
                hand.cards.forEach(card => {
                    const cardNode = this.main.createCard(card);
                    const cardComponent = cardNode.getComponent(NewCard);
                    cardComponent.faceUp();
                    place.addCard(cardNode);
                    place.cardLayout.updateLayout();
                });

                this.main.chipContainers[pos].destroyAllChildren();
                const chipStack = this.main.betChips.createChipStack(hand.bet, this.main.chipOption);
                this.main.chipContainers[pos].addChild(chipStack);
                place.updateDisplayBetValue(hand.bet);
                place.updateDisplayStatus(hand.total);
            });

            this.main.switchToNextHand();
        }
    }
}