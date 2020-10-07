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
        }
        return true;
    }

    processFinish() {
        const finish = this.finishDataCache;
        if (!finish) {
            console.error("BlackJack data finish did not receive");
            return;
        }

        const openCardDuration = 0.7;
        this.main.dealerOpenSecondCard(finish.results[1], openCardDuration);

        cc.tween(this.main)
            .delay(openCardDuration)
            .call(() => {
                this.drawMoreCardForDealer(finish.results.slice(2));
            })
            .start();
    }

    drawMoreCardForDealer(cards: CardModel[]) {
        const actions = [];
        if (cards.length > 0) {
            cards.forEach((card, index) => {
                actions.push(() => { this.main.drawingCardToDealer(card, false); });
            })
        }
        actions.push(() => this.showWinningHands());
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
