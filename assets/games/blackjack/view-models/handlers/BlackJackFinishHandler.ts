import ChipStack from "../../../../common/chip-stack/views/ChipStack";
import GameUtils from "../../../../common/GameUtils";
import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import { playWinningEffect } from "../../../_base/action/PayChipsAction";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import BlackJack, { BlackJackActionType } from "../BlackJack";
import BlackJackUtils from "../BlackJackUtils";

export default class BlackJackFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: BlackJack) {
        super(main);
    }

    finishDataCache: any = null;
    drawingCardDelay = 0.5;
    openCardDuration = 0.7;

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

    startNewRound() {
        this.main.gameAudios.playStartGameAudio();
        this.main.showActionsWithBehavior(BlackJackActionType.END_ROUND);
        this.main.stopIntervalReminder();
    }

    processFinish() {
        const finish = this.finishDataCache;
        if (!finish) {
            this.showLogNotReceiveData();
            return;
        }
        const totals = BlackJackUtils.getTotal(finish.result, 2);
        const isBlackJack = finish.result.length === 2 && totals[totals.length - 1] === 21;

        if (isBlackJack) {
            this.finishBlackJackCase(finish);
        } else {
            this.finishNormalCase(finish);
        }
    }

    showLogNotReceiveData() {
        console.error("BlackJack data finish did not receive");
    }

    finishBlackJackCase(finish) {
        this.main.dealerHand.cardLayout.updateLayout();
        this.main.dealerHand.showScoreWithOutData(finish.result, 2, true);
        this.showWinningHands();
        this.startNewRound();
    }

    async finishNormalCase(finish) {
        await this.openFaceDownDealerCards(finish);
        cc.tween(this.main)
            .call(() => {
                this.main.dealerHand.showScoreWithOutData(finish.result, 2);
                this.drawMoreCardForDealer(finish.result, () => {
                    cc.tween(this.main)
                        .delay(1)
                        .call(() => {
                            this.main.dealerHand.cardLayout.updateLayout();
                            this.main.dealerHand.showScoreWithOutData(finish.result, finish.result.length, true);
                            this.showWinningHands();

                            this.startNewRound();
                        })
                        .start();
                });
            })
            .start();
    }

    async openFaceDownDealerCards(finish) {
        this.main.dealerOpenSecondCard(finish.result[1], this.openCardDuration);
        await GameUtils.delayTime(this.openCardDuration);
    }

    drawMoreCardForDealer(cards: CardModel[], complete = () => {}) {
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
            });
        }
        let count = 0;
        cc.tween(this.main)
            .repeat(
                actions.length,
                cc
                    .tween()
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
        let totalBet = 0;

        this.main.handPlaces.forEach((place, index) => {
            if (place.isActive) {
                const hand = winningHands.find((hand) => hand.id === place.idValue);
                const betAmount = place.getBetAmount();
                totalBet += betAmount;
                if (hand) {
                    totalWin += +hand.betwin;
                    place.cardLayout.updateLayout();
                    place.setResult(hand.betwin);

                    if (+hand.betwin > betAmount) {
                        this.handleHandAction(hand, betAmount, index);
                    }
                } else {
                    const chip = this.getChipsHandPlace(index);
                    this.main.handPlaces[index].showBetValue(false);
                    const destPos = chip.parent.convertToNodeSpaceAR(this.main.dealerChipTray.convertToWorldSpaceAR(cc.v2(0, 0)));
                    chip.runAction(
                        cc.sequence(
                            cc.spawn(cc.jumpTo(0.8, destPos, 100, 1), cc.scaleTo(0.8, 0.5)),
                            cc.delayTime(0.1),
                            cc.fadeOut(0.3),
                            cc.callFunc(() => {
                                chip.destroy();
                            })
                        )
                    );
                }
            }
        });

        totalWin > 0 && this.main.showWinningBet(totalWin);
        if (totalWin > totalBet) {
            playWinningEffect(this.main, this.main.userProfile.node, 5);
        }
        this.main.updateUserBalance();
    }

    getChipsHandPlace(index: number) {
        return this.main.chipContainers[index].children[0];
    }

    handleHandAction(hand: any, betAmount: any, index: number) {
        const winAmount = +hand.betwin - betAmount;
        const destNode = this.main.chipContainers[index];
        const chipStack = this.main.createChipStack(winAmount, destNode);
        const startPos = chipStack.parent.convertToNodeSpaceAR(this.main.dealerChipTray.convertToWorldSpaceAR(cc.v2(0, 0)));
        chipStack.position = cc.v3(startPos);

        let destPosition = cc.v2(0, 0);
        if (destNode.childrenCount > 0) {
            const stack = destNode.children[0].getComponent(ChipStack);
            if (stack) {
                destPosition = cc.v2(0, stack.getCurrentHeight());
            }
        }
        chipStack.scale = 0.5;
        chipStack.runAction(
            cc.sequence(
                cc.spawn(cc.jumpTo(0.8, destPosition, 100, 1), cc.scaleTo(0.8, 1)),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    destNode.destroyAllChildren();
                    this.main.createChipStack(+hand.betwin, destNode);
                })
            )
        );
    }
}
