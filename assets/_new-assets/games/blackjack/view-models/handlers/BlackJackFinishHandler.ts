import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";


export default class BlackJackFinishHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    finishDataCache: any;
    drawingCardDelay = 0.5;

    handle(data: any): boolean {
        if (data.finish) {
            this.finishDataCache = data.finish;

            this.processFinish();
        }
        return true;
    }

    processFinish() {
        console.log("processFinish ====================");
        const finish = this.finishDataCache;
        if (!finish) {
            console.error("BlackJack data finish did not receive");
            return;
        }

        const openCardDuration = 0.7;
        this.main.dealerOpenSecondCard(finish.result[1], openCardDuration);
        this.main.dealerHand.showScoreWithOutData(finish.result, 2);

        cc.tween(this.main)
            .delay(openCardDuration)
            .call(() => {
                this.drawMoreCardForDealer(finish.result);
            })
            .start();
    }

    drawMoreCardForDealer(cards: CardModel[]) {
        const actions = [];

        const moreCards = cards.slice(2);
        if (moreCards.length > 0) {
            moreCards.forEach((card, index) => {
                actions.push(() => {
                    this.main.drawingCardToDealer(card, false);
                    this.main.dealerHand.showScoreWithOutData(cards, index + 3, index === moreCards.length - 1);
                });
            })
        }
        actions.push(() => {
            this.showWinningHands();

            this.main.rebetButton.active = true;
            this.main.newBetButton.active = true;
        });
        let count = 0;
        cc.tween(this.main)
            .repeat(actions.length,
                cc.tween()
                    .call(() => {
                        actions[count]();
                        count++;
                    })
                    .delay(this.drawingCardDelay)
            )
            .start();
    }

    showWinningHands() {
        const winningHands = this.finishDataCache.winningHands;
        winningHands.forEach(hand => {
            const wonPlace = this.main.handPlaces.find(place => place.isActive && place.idValue === hand.id);
            wonPlace && wonPlace.setResult(hand.betwin);
        });
    }
}
