import ChipStack from "../../../../common/chip-stack/views/ChipStack";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";
import BlackJackUtils from "../BlackJackUtils";

export default class IngameActionHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {}

    handle(data: any): boolean {
        if (data.hit) {
            this.processHitAction(data.hit);
            this.main.showProcessingWarning(false);
            this.main.updateAvailableActions();
        }

        if (data.stand) {
            this.processStandAction(data.stand);
            this.main.showProcessingWarning(false);
        }

        if (data.double) {
            this.processDoubleAction(data.double);
        }

        if (data.split) {
            this.processSplitAction(data.split);
            this.main.updateAvailableActions();
        }
        return true;
    }

    processSplitAction(split: any) {
        const hands = split.hands;
        const firstHand = hands[0];
        const secondHand = hands[1];

        const firstPlace = this.main.handPlaces[firstHand.pos - 1];
        const secondPlace = this.main.handPlaces[firstHand.pos + 2];
        firstPlace.setData(firstHand);
        secondPlace.setData(secondHand);

        secondPlace.syncBetValue();
        this.placeChipsForSplitHand(firstHand.pos + 2, firstHand.bet);
        this.main.lockBet();
        cc.tween(this.main)
            .call(() => {
                this.moveCardForSplitting(firstHand.pos, 0.3);
                firstPlace.updateDisplayScore(false);
                secondPlace.updateDisplayScore(false);
            })
            .delay(0.5)
            .call(() =>
                this.main.drawingCardToPlayer(firstHand.cards[1], firstHand.pos - 1, () => {
                    firstPlace.updateDisplayScore(true);
                })
            )
            .delay(0.5)
            .call(() => {
                this.main.drawingCardToPlayer(secondHand.cards[1], secondHand.pos - 1, () => {
                    secondPlace.updateDisplayScore(true);
                });
            })
            .delay(this.main.configDuration.delaySwitchHand)
            .call(() => {
                firstPlace.selected = !firstHand.isStand;
                this.main.switchToNextHand();
                this.main.unlockBet();
            })
            .start();
    }

    moveCardForSplitting(handPos: number, duration: number) {
        const pos = handPos - 1;
        const destPos = pos + 3;
        const cardNodes = this.main.handPlaces[pos].getCards();
        const secondCard = cardNodes[1];

        secondCard.removeFromParent();

        const cardLayout = this.main.handPlaces[destPos].cardLayout;
        const nextPosition = cardLayout.getNextPosition();
        const rotationX = 0;
        const scaleY = 1;
        this.main.handPlaces[destPos].addCard(secondCard);

        cc.tween(secondCard).to(duration, { position: nextPosition, rotationX: rotationX, scaleY: scaleY }, { easing: "easeOut" }).start();
    }

    processStandAction(data: any) {
        const pos = data.pos - 1;
        const place = this.main.handPlaces[pos];
        place.setData(data);
        place.selected = false;
        place.updateDisplayScore(true);

        this.main.updateAvailableActions();
        cc.tween(this.main)
            .delay(this.main.configDuration.delaySwitchHand)
            .call(() => this.main.switchToNextHand())
            .start();
    }

    processDoubleAction(data: any) {
        this.processHitAction(data);
        this.placeChipsForDoubleHand(data.pos - 1, data.bet);
    }

    processHitAction(data: any) {
        const card = data.newCard;
        const pos = data.pos - 1;
        const place = this.main.handPlaces[pos];
        place.setData(data);
        place.syncBetValue();

        const isStand = data.isStand;
        this.main.drawingCardToPlayer(
            card,
            pos,
            isStand
                ? () => {
                      place.updateDisplayScore(true);
                      place.selected = false;
                      this.main.updateAvailableActions();
                      cc.tween(this.main)
                          .delay(this.main.configDuration.delaySwitchHand)
                          .call(() => this.main.switchToNextHand())
                          .start();
                  }
                : () => {
                      place.updateDisplayScore(true);
                  }
        );
    }

    placeChipsForSplitHand(index: number, amount: number) {
        const destNode = this.main.chipContainers[index];
        destNode.destroyAllChildren();
        const chipStack = BlackJackUtils.createChipStack(
            amount,
            this.main.betChips,
            this.main.chipOption,
            this.main.shadowChip,
            destNode.skewX
        );
        chipStack.zIndex = -1;
        destNode.addChild(chipStack);

        const worldPositon = destNode.parent.convertToWorldSpaceAR(cc.v2(0, -300));
        const localPosition = destNode.convertToNodeSpaceAR(worldPositon);
        chipStack.position = localPosition;
        chipStack.runAction(cc.jumpTo(0.5, 0, 0, 250, 1));
        this.main.updateTotalBetLabel();
    }

    placeChipsForDoubleHand(index: number, amount: number) {
        const destNode = this.main.chipContainers[index];
        const chipStack = BlackJackUtils.createChipStack(
            amount / 2,
            this.main.betChips,
            this.main.chipOption,
            this.main.shadowChip,
            destNode.skewX
        );
        chipStack.zIndex = -1;
        destNode.addChild(chipStack);

        const worldPositon = destNode.parent.convertToWorldSpaceAR(cc.v2(0, -300));
        const localPosition = destNode.convertToNodeSpaceAR(worldPositon);
        chipStack.position = localPosition;

        let destPosition = cc.v2(0, 0);
        if (destNode.childrenCount > 0) {
            const stack = destNode.children[0].getComponent(ChipStack);
            if (stack) {
                destPosition = cc.v2(0, stack.getCurrentHeight());
            }
        }

        chipStack.runAction(
            cc.sequence(
                cc.jumpTo(0.5, destPosition, 250, 1),
                cc.callFunc(() => {
                    destNode.destroyAllChildren();
                    const chipStack = BlackJackUtils.createChipStack(
                        amount,
                        this.main.betChips,
                        this.main.chipOption,
                        this.main.shadowChip,
                        destNode.skewX
                    );
                    chipStack.zIndex = -1;
                    destNode.addChild(chipStack);
                    this.main.handPlaces[index].updateDisplayBetValue(amount);
                    this.main.updateTotalBetLabel();
                })
            )
        );
    }
}
