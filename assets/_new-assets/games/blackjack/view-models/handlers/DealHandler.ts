import a from "../../../../../libs/chance/chance";
import NewCard, { CardAnimation, CardModel } from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";

export default class DealHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.deal) {
            this.processData(data.deal);
            this.main.showProcessingWarning(false);
        }
        return true;
    }

    processData(data: any) {
        const hands = data.hands.sort((a, b) => a.pos < b.pos);
        const dealerCards = data.dealer;

        const actions = [];
        hands.forEach(hand => {
            const card = hand.cards[0];
            const pos = hand.pos - 1;

            const place = this.main.handPlaces[pos];
            place.setData(hand);

            actions.push(() => this.main.drawingCardToPlayer(card, pos, () => place.updateDisplayScore(false)));

            if (hand.bet != place.getBetAmount()) {
                place.syncBetValue();
                this.main.chipContainers[pos].destroyAllChildren();
                const chipStack = this.main.betChips.createChipStack(hand.bet, this.main.chipOption);
                this.main.chipContainers[pos].addChild(chipStack);
            }
        });

        const firstDealerCard = dealerCards[0];
        actions.push(() => { this.main.drawingCardToDealer(firstDealerCard, false); });
        hands.forEach(hand => {
            const card = hand.cards[1];
            const pos = hand.pos - 1;
            const place = this.main.handPlaces[pos];
            actions.push(() => this.main.drawingCardToPlayer(card, pos, () => place.updateDisplayScore(true)));
        });

        const isBlackJack = dealerCards.length > 1;
        if (isBlackJack) {
            actions.push(() => {
                this.main.drawingCardToDealer(dealerCards[1], true, () => this.main.dealerHand.showScoreWithOutData(dealerCards, 1));
            });
        } else {
            actions.push(() => {
                this.main.drawingCardToDealer(null, true, () => this.main.dealerHand.showScoreWithOutData(dealerCards, 1));
            });
        }

        let count = 0;
        cc.tween(this.main)
            .repeat(actions.length, cc.tween()
                .call(() => {
                    actions[count]();
                    count++;
                })
                .delay(this.main.configDuration.drawingCardDelay)
            )
            .call(() => { this.playAnimationDealerCheck(dealerCards, isBlackJack); })
            .start();

        this.main.hideAllButtons();
        this.main.handPlaces.forEach(place => {
            place.highlightPlace(false);
            place.enablePlaceChip(false);
            place.showClearBetButton(false);
        });
    }

    playAnimationDealerCheck(dealerCards: CardModel[], isBlackJack: boolean) {
        console.log("dealer check cards");
        const checkList = ["A", "J", "Q", "K", "10"];
        let delaytime = 1;
        if (checkList.includes(dealerCards[0].rank)) {
            const secondCard = this.main.dealerHand.cardLayout.content.children[1].getComponent(NewCard);
            const checkDuration = 1.5;
            secondCard.playAnimation(isBlackJack ? CardAnimation.DealerCheckBlackJackSuccess : CardAnimation.DealerCheckBlackJackFail, checkDuration);
            delaytime += checkDuration;
        }

        cc.tween(this.main)
            .delay(delaytime)
            .call(() => {
                if (isBlackJack) {
                    this.main.dealerHand.showScoreWithOutData(dealerCards, 2);
                    this.main.switchToDealer();
                } else {
                    this.main.startRound();
                }
            })
            .start();
    }
}
