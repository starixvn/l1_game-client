import a from "../../../../../libs/chance/chance";
import NewCard, { CardAnimation, CardModel } from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";
import BlackJackUtils from "../BlackJackUtils";
import FadeEffectButton from '../../../../common/custom-button/FadeEffectButton';

export default class DealHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.deal) {
            this.processDealSuccess(data.deal);
            this.main.showProcessingWarning(false);
        }

        if (data.blackjackNotice) {
            this.processFailedDealHands(data.blackjackNotice);
        }
        return true;
    }

    processDealSuccess(data: any) {
        const hands = data.hands.sort((a, b) => +a.pos - +b.pos);
        this.main.lastHandBets = data.hands.map(hand => {
            return {
                pos: hand.pos,
                bet: hand.bet
            };
        })
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
                const chipStack = BlackJackUtils.createChipStack(hand.bet, this.main.betChips.chipAltas, this.main.chipOption, this.main.shadowChip, this.main.chipContainers[pos].skewX);
                this.main.chipContainers[pos].addChild(chipStack);
            }
        });
        this.main.updateTotalBetLabel();

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
                this.main.drawingCardToDealer(dealerCards[1], true, () => {
                    this.main.dealerHand.showScoreWithOutData(dealerCards, 1);
                    this.main.dealerHand.cardLayout.updateLayout();
                });
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
                    this.main.dealerHand.cardLayout.updateLayout();
                    this.main.dealerHand.showScoreWithOutData(dealerCards, 2);
                    this.main.switchToDealer();
                } else {
                    this.main.startRound();
                }
            })
            .start();
    }

    processFailedDealHands(data: any) {
        if (data.errorApiHands) {
            this.showNoticesErrors(data.errorApiHands);
        }
        if (data.kickedOutHands) {
            data.kickedOutHands.forEach(error => {
                const transferredData = {
                    kickedOut: error
                };
                this.main.currentMiniPanel.onGeneralData(transferredData);
            })
        }
        if (data.invalidBetAmountHands) {
            this.main.showMiniWarning(data.invalidBetAmountHands.message);
            const positions = data.invalidBetAmountHands.pos;
            this.clearChipsAndShowErrorNotice(positions);
        }
    }

    showNoticesErrors(data: any) {
        data.forEach(error => {
            const notice = this.main.currentMiniPanel.showErrorNotice(error);
            notice.handleClose = () => {
                const positions = error.pos;
                this.clearChipsAndShowErrorNotice(positions);
            }
        });
    }

    clearChipsAndShowErrorNotice(positions: number[]) {
        positions.forEach(position => {
            const place = this.main.handPlaces[position - 1];
            place.showErrorNotice();
            const chipContainer = this.main.chipContainers[position - 1];
            const chips = chipContainer.children[0];
            const destPosition = chipContainer.convertToNodeSpaceAR(chipContainer.parent.convertToWorldSpaceAR(cc.v2(0, -300)));
            this.main.dealButton.getComponent(FadeEffectButton).setActive(false);
            this.main.clearButton.getComponent(FadeEffectButton).setActive(false);
            this.main.rebetButton.getComponent(FadeEffectButton).setActive(false);
            this.main.newBetButton.getComponent(FadeEffectButton).setActive(false);
            chips.runAction(cc.sequence(
                cc.jumpTo(0.7, destPosition, 250, 1),
                cc.delayTime(1.8),
                cc.callFunc(() => {
                    place.onClearBetClick();
                })));
        });
    }
}
