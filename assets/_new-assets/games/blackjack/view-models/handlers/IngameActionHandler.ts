import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";


export default class IngameActionHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.hit) {
            this.processHitAction(data.hit);
            this.main.showProcessingWarning(false);
        }

        if (data.stand) {
            this.processStandAction(data.stand);
            this.main.showProcessingWarning(false);
        }

        if (data.double) {
            this.processDoubleAction(data.double);
            this.main.showProcessingWarning(false);
        }

        if (data.split) {
            this.processSplitAction(data.split);
            this.main.showProcessingWarning(false);
        }
        return true;
    }

    processSplitAction(split: any) {
        const hands = split.data.hands;
        const firstHand = hands[0];
        const secondHand = hands[1];

        const firstPlace = this.main.handPlaces[firstHand.pos - 1];
        const secondPlace = this.main.handPlaces[firstHand.pos + 2];
        firstPlace.setData(firstHand);
        secondPlace.setData(secondHand);

        this.placeChipsForSplitHand(firstHand.pos + 2, split.endBet);
        cc.tween(this.main)
            .call(() => {
                this.moveCardForSplitting(firstHand.pos, 0.3);
                firstPlace.updateDisplayScore(false);
                secondPlace.updateDisplayScore(false);
            })
            .delay(0.5)
            .call(() => this.main.drawingCardToPlayer(firstHand.cards[1], firstHand.pos - 1, () => {
                firstPlace.updateDisplayScore(true);
            }))
            .delay(0.5)
            .call(() => this.main.drawingCardToPlayer(secondHand.cards[1], secondHand.pos - 1, () => {
                secondPlace.updateDisplayScore(true);
            }))
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
        const place = this.main.handPlaces[pos];
        place.setData(data);
        place.selected = false;
        place.updateDisplayScore(true);

        this.main.switchToNextHand();
    }

    processDoubleAction(data: any) {
        this.processHitAction(data);
        this.placeChipsForDoubleHand(data.pos - 1, data.endBet);
    }

    processHitAction(data: any) {
        const card = data.newCard;
        const pos = data.pos - 1;
        const place = this.main.handPlaces[pos];
        place.setData(data);

        const isStand = data.isStand;
        this.main.drawingCardToPlayer(card, pos, isStand ? () => {
            place.updateDisplayScore(true);
            place.selected = false;
            this.main.switchToNextHand();
        } : () => {
            place.updateDisplayScore(true);
        });
    }

    placeChipsForSplitHand(index: number, amount: number) {
        const destNode = this.main.chipContainers[index];
        destNode.destroyAllChildren();
        const chipStack = this.main.betChips.createChipStack(amount, this.main.chipOption);
        chipStack.zIndex = -1;
        destNode.addChild(chipStack);

        const worldPositon = destNode.parent.convertToWorldSpaceAR(cc.v2(0, -300));
        const localPosition = destNode.convertToNodeSpaceAR(worldPositon);
        chipStack.position = localPosition;
        chipStack.runAction(cc.jumpTo(0.5, 0, 0, 250, 1));
    }

    placeChipsForDoubleHand(index: number, amount: number) {
        const destNode = this.main.chipContainers[index];
        const chipStack = this.main.betChips.createChipStack(amount, this.main.chipOption);
        chipStack.zIndex = -1;
        destNode.addChild(chipStack);

        const worldPositon = destNode.parent.convertToWorldSpaceAR(cc.v2(0, -300));
        const localPosition = destNode.convertToNodeSpaceAR(worldPositon);
        chipStack.position = localPosition;
        chipStack.runAction(cc.sequence(
            cc.jumpTo(0.5, 0, 0, 250, 1),
            cc.callFunc(() => {
                destNode.destroyAllChildren();
                const chipStack = this.main.betChips.createChipStack(amount * 2, this.main.chipOption);
                chipStack.zIndex = -1;
                destNode.addChild(chipStack);
            })
        ));
    }
}
