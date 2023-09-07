import * as _ from "lodash";

import NewCard from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";
import BlackJackUtils from "../BlackJackUtils";

export default class BlackJackIngameHandler implements DataHandler {
    constructor(protected readonly main: BlackJack) {}

    handle(data: any) {
        if (data.ownBets) {
            this.processIngame(data.ownBets);
        }
    }

    processIngame(ownBets: any) {
        if (_.isEmpty(ownBets)) {
            this.main.newGame();
        } else {
            this.main.setIntervalReminder();
            this.createDealerCards(ownBets.dealer);
            const hands = ownBets.hands;
            hands.forEach((hand) => {
                const pos = hand.pos - 1;

                if (hand.pos < 4) {
                    let originalBet = hand.bet;
                    if (hand.actions.includes("double")) {
                        originalBet = originalBet / 2;
                    }
                    this.main.lastHandBets.push({ pos: hand.pos, bet: originalBet });
                }
                const place = this.main.handPlaces[pos];
                place.showBetText(false);
                place.setData(hand);
                hand.cards.forEach((card) => {
                    const cardNode = this.main.createCard(card);
                    const cardComponent = cardNode.getComponent(NewCard);
                    cardComponent.faceUp();
                    place.addCard(cardNode);
                    place.cardLayout.updateLayout();
                });

                this.main.chipContainers[pos].destroyAllChildren();
                const chipStack = BlackJackUtils.createChipStack(
                    hand.bet,
                    this.main.betChips,
                    this.main.shadowChip,
                    this.main.chipContainers[pos].skewX
                );
                this.main.chipContainers[pos].addChild(chipStack);
                place.syncBetValue();
                place.updateDisplayScore(true);
            });

            this.main.handPlaces.forEach((place) => place.enablePlaceChip(false));
            this.main.updateTotalBetLabel();
            this.main.switchToNextHand();
        }
    }

    createDealerCards(dealerCards) {
        dealerCards.forEach((card) => {
            const cardNode = this.main.createCard(card);
            this.main.dealerHand.addCard(cardNode);

            const cardComponent = cardNode.getComponent(NewCard);
            cardComponent.faceUp();
        });

        if (dealerCards.length < 2) {
            this.createFaceDownCards(1);
            this.main.dealerHand.cardLayout.updateLayout();
            this.main.dealerHand.showScoreWithOutData(dealerCards, 1);
        }
    }

    createFaceDownCards(noOfCards: number) {
        for (let i = 0; i < noOfCards; i++) {
            const cardNode = this.main.createCard(null);
            const cardComponent = cardNode.getComponent(NewCard);
            cardComponent.faceDown();
            this.main.dealerHand.addCard(cardNode);
        }
    }
}
