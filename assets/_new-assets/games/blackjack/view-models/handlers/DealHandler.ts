import a from "../../../../../libs/chance/chance";
import NewCard, { CardAnimation, CardModel } from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";
import BlackJackFinishHandler from "./BlackJackFinishHandler";

export default class DealHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    drawingCardDelay = 0.7;

    handle(data: any): boolean {
        if (data.deal) {
            this.processData(data.deal);
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
            actions.push(() => { this.main.drawingCardToPlayer(card, pos); });

            this.main.handPlaces[pos].setData(hand);
            if (hand.bet != this.main.handPlaces[pos].getBetAmount()) {
                this.main.handPlaces[pos].syncBetValue();
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
            actions.push(() => { this.main.drawingCardToPlayer(card, pos); });
        });

        const isBlackJack = dealerCards.length > 1;
        if (isBlackJack) {
            actions.push(() => { this.main.drawingCardToDealer(dealerCards[1], true); });
        } else {
            actions.push(() => { this.main.drawingCardToDealer(null, true); });
        }

        let count = 0;
        cc.tween(this.main)
            .repeat(actions.length, cc.tween()
                .call(() => {
                    actions[count]();
                    count++;
                })
                .delay(this.drawingCardDelay)
            )
            .call(() => { this.playAnimationDealerCheck(dealerCards[0], isBlackJack); })
            .start();

        this.main.handPlaces.forEach(place => {
            place.highlightPlace(false);
            place.enablePlaceChip(false);
        });
    }

    playAnimationDealerCheck(firstDealerCard: CardModel, isBlackJack: boolean) {
        console.log("dealer check cards");
        const checkList = ["A", "J", "Q", "K", "10"];
        let delaytime = 1;
        if (checkList.includes(firstDealerCard.rank)) {
            const secondCard = this.main.dealerHand.cardLayout.content.children[1].getComponent(NewCard);
            const checkDuration = 1.5;
            secondCard.playAnimation(CardAnimation.DealerCheckBlackJackFail, checkDuration);
            delaytime += checkDuration;
        }

        cc.tween(this.main)
            .delay(delaytime)
            .call(() => {
                if (isBlackJack) {
                    const finishHandler = this.main.finishHandler as BlackJackFinishHandler;
                    finishHandler.showWinningHands();
                } else {
                    this.main.startRound();
                }
            })
            .start();
    }
}
