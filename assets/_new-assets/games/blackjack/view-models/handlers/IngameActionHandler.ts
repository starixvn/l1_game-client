import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";


export default class IngameActionHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.hit) {
            this.processHitAction(data.hit);
        }

        if (data.stand) {
            this.processStandAction(data.stand);
        }

        if (data.double) {
            this.processDoubleAction(data.double);
        }

        if (data.split) {
            this.processSplitAction(data.split);
        }
        return true;
    }

    processSplitAction(split: any) {
        const hands = split.data.hands;
        const firstHand = hands[0];
        const secondHand = hands[1];

        this.main.handPlaces[firstHand.pos - 1].setData(firstHand);
        this.main.handPlaces[firstHand.pos + 2].setData(secondHand);

        cc.tween(this.main)
            .call(() => this.moveCardForSplitting(firstHand.pos, 0.3))
            .delay(0.5)
            .call(() => this.main.drawingCardToPlayer(firstHand.cards[1], firstHand.pos - 1))
            .delay(0.5)
            .call(() => this.main.drawingCardToPlayer(secondHand.cards[1], secondHand.pos - 1))
            .start();
    }

    moveCardForSplitting(handPos: number, duration: number) {
        const pos = handPos - 1;
        const destPos = pos + 3;
        const cardNodes = this.main.handPlaces[pos].getCards();
        const secondCard = cardNodes[1];

        secondCard.removeFromParent();

        const nextPosition = this.main.handPlaces[destPos].cardLayout.getNextPosition();
        this.main.handPlaces[destPos].addCard(secondCard);

        cc.tween(secondCard)
            .to(duration, { position: nextPosition })
            .start();
    }

    processStandAction(data: any) {
        const pos = data.pos - 1;
        this.main.handPlaces[pos].setData(data);
        this.main.handPlaces[pos].selected = false;
        this.main.switchToNextHand();
    }

    processDoubleAction(data: any) {
        this.processHitAction(data);
        //throw chip
    }

    processHitAction(data: any) {
        const card = data.newCard;
        const pos = data.pos - 1;
        this.main.handPlaces[pos].setData(data);

        const isStand = data.isStand;
        this.main.drawingCardToPlayer(card, pos, isStand ? () => {
            this.main.handPlaces[pos].selected = false;
            this.main.switchToNextHand();
        } : () => { });
    }
}
