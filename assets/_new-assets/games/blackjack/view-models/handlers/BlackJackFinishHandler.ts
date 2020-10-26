import ChipStack from "../../../../common/chip-stack/views/ChipStack";
import FadeEffectButton from "../../../../common/custom-button/FadeEffectButton";
import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";
import BlackJackUtils from "../BlackJackUtils";


export default class BlackJackFinishHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    finishDataCache: any = null;
    drawingCardDelay = 0.5;

    handle(data: any): boolean {
        if (data.finish) {
            this.finishDataCache = data.finish;
            this.main.finishRound();
        }
        return true;
    }

    clearCache() {
        this.finishDataCache = null;
    }

    processFinish() {
        const finish = this.finishDataCache;
        if (!finish) {
            console.error("BlackJack data finish did not receive");
            return;
        }
        const totals = BlackJackUtils.getTotal(finish.result, 2);
        if (finish.result.length === 2 && totals[totals.length - 1] === 21) {
            this.main.dealerHand.cardLayout.updateLayout();
            this.main.dealerHand.showScoreWithOutData(finish.result, 2, true);
            this.showWinningHands();

            this.main.rebetButton.getComponent(FadeEffectButton).setActive();
            this.main.newBetButton.getComponent(FadeEffectButton).setActive();
        } else {
            const openCardDuration = 0.7;
            this.main.dealerOpenSecondCard(finish.result[1], openCardDuration);

            cc.tween(this.main)
                .delay(openCardDuration)
                .call(() => {
                    this.main.dealerHand.showScoreWithOutData(finish.result, 2);
                    this.drawMoreCardForDealer(finish.result, () => {
                        cc.tween(this.main)
                            .delay(1)
                            .call(() => {
                                this.main.dealerHand.cardLayout.updateLayout();
                                this.main.dealerHand.showScoreWithOutData(finish.result, finish.result.length, true);
                                this.showWinningHands();

                                this.main.rebetButton.getComponent(FadeEffectButton).setActive();
                                this.main.newBetButton.getComponent(FadeEffectButton).setActive();
                            })
                            .start();
                    });
                })
                .start();
        }
    }

    drawMoreCardForDealer(cards: CardModel[], complete = () => { }) {
        if (cards.length === 2) {
            complete();
            return;
        }
        const actions = [];
        const moreCards = cards.slice(2);
        if (moreCards.length > 0) {
            moreCards.forEach((card, index) => {
                actions.push(() => {
                    this.main.drawingCardToDealer(card, false, () => {
                        this.main.dealerHand.showScoreWithOutData(cards, index + 3, false);
                    });
                });
            })
        }
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
            .call(complete)
            .start();
    }

    showWinningHands() {
        const winningHands = this.finishDataCache.winningHands;
        let totalWin = 0;

        this.main.handPlaces.forEach((place, index) => {
            if (place.isActive) {
                const hand = winningHands.find(hand => hand.id === place.idValue)
                if (hand) {
                    totalWin += +hand.betwin;
                    place.cardLayout.updateLayout();
                    place.setResult(hand.betwin);

                    if (+hand.betwin > place.getBetAmount()) {
                        const winAmount = +hand.betwin - place.getBetAmount();
                        const options = [...this.main.chipOption, 0.5];
                        const chipStack = BlackJackUtils.createChipStack(winAmount, this.main.betChips.chipAltas, options);
                        const destNode = this.main.chipContainers[index];
                        destNode.addChild(chipStack);
                        const startPos = chipStack.parent.convertToNodeSpaceAR(this.main.dealerChipTray.convertToWorldSpaceAR(cc.v2(0, 0)));
                        chipStack.position = startPos;

                        let destPosition = cc.v2(0, 0);
                        if (destNode.childrenCount > 0) {
                            const stack = destNode.children[0].getComponent(ChipStack);
                            if (stack) {
                                destPosition = cc.v2(0, stack.getCurrentHeight());
                            }
                        }
                        chipStack.runAction(cc.sequence(
                            cc.jumpTo(0.8, destPosition, 100, 1),
                            cc.delayTime(0.1),
                            // cc.fadeOut(0.3),
                            cc.callFunc(() => {
                                destNode.destroyAllChildren();
                                const chipStack = BlackJackUtils.createChipStack(+hand.betwin, this.main.betChips.chipAltas, options);
                                destNode.addChild(chipStack);
                            })
                        ))
                    }
                } else {
                    const chip = this.main.chipContainers[index].children[0];
                    this.main.handPlaces[index].showBetValue(false);
                    const destPos = chip.parent.convertToNodeSpaceAR(this.main.dealerChipTray.convertToWorldSpaceAR(cc.v2(0, 0)));
                    chip.runAction(cc.sequence(
                        cc.jumpTo(0.8, destPos, 100, 1),
                        cc.delayTime(0.1),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {
                            chip.destroy();
                        })
                    ))
                }
            }
        })

        totalWin > 0 && this.main.showWinningBet(totalWin);
        cc.RedT.send({
            user: {
                updateCoin: true
            }
        });
    }
}
