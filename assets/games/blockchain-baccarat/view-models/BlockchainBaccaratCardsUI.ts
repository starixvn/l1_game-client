import { Blockchain } from "./../event-models/BlockchainBaccaratCardListModel";
import { BlockchainBaccaratRoundHistory } from "../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratCardsShuffle from "./card-shuffle/BlockchainBaccaratCardsShuffle";
import BlockchainBaccaratCards from "./card/BlockchainBaccaratCards";
import BlockchainCard from "./card-list/BlockchainCard";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

export enum CardsOrder {
    card1 = 0,
    card2,
    card3
}

type OrderCardValue = {
    node: BlockchainBaccaratCards;
    key: number;
};

enum CountCardFlied {
    FourCards = 4,
    FiveCards,
    SixCards
}

@ccclass
export default class BlockchainBaccaratCardsUI extends cc.Component {
    @property(BlockchainBaccaratCards)
    bankerCards: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    playerCards: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    reserveCards: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCardsShuffle)
    burnContainer: BlockchainBaccaratCardsShuffle = null;

    @property(cc.Label)
    winningNotice: cc.Label = null;

    protected orderCard: OrderCardValue[];

    onLoad() {
        this?.burnContainer?.node && (this.burnContainer.node.active = false);
        this.orderCard = [
            { node: this.playerCards, key: CardsOrder.card1 },
            { node: this.bankerCards, key: CardsOrder.card1 },
            { node: this.playerCards, key: CardsOrder.card2 },
            { node: this.bankerCards, key: CardsOrder.card2 },
            { node: this.reserveCards, key: CardsOrder.card1 },
            { node: this.reserveCards, key: CardsOrder.card2 }
        ];
    }

    handleNumberIndex(currentIndex: number) {
        this.orderCard.forEach((card) => {
            card.node.setTagIndex(currentIndex, card.node.cards[card.key]);
            currentIndex++;
        });
    }

    async handleFlyCards(currentIndex: number, numberCardsFlied: number) {
        switch (numberCardsFlied) {
            case CountCardFlied.FourCards:
                await this.reserveCards.flyCard1Reserve({
                    numberTag: currentIndex,
                    card: this.playerCards.cards[CardsOrder.card1],
                    start: this.reserveCards.cards[CardsOrder.card1],
                    callBack: () => {
                        this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card1]);
                    }
                });

                await this.reserveCards.flyCard1Reserve({
                    numberTag: currentIndex + 1,
                    card: this.bankerCards.cards[CardsOrder.card1],
                    start: this.reserveCards.cards[CardsOrder.card2],
                    callBack: () => {
                        this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
                    }
                });
                await this.playerCards.flyCard2(currentIndex + 2);
                await this.bankerCards.flyCard2(currentIndex + 3);
                await this.reserveCards.flyCard1(currentIndex + 4, this.reserveCards.durationFlyCard3);
                await this.reserveCards.flyCard2(currentIndex + 5, this.reserveCards.durationFlyCard3);
                break;
            case CountCardFlied.FiveCards:
                await this.reserveCards.flyCard1Reserve({
                    numberTag: currentIndex,
                    card: this.playerCards.cards[CardsOrder.card1],
                    start: this.reserveCards.cards[CardsOrder.card2],
                    callBack: () => {
                        this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
                    }
                });

                await this.bankerCards.flyCard1(currentIndex + 1);
                await this.playerCards.flyCard2(currentIndex + 2);
                await this.bankerCards.flyCard2(currentIndex + 3);
                await this.reserveCards.flyCard1(currentIndex + 4, this.reserveCards.durationFlyCard3);
                await this.reserveCards.flyCard2(currentIndex + 5, this.reserveCards.durationFlyCard3);
                break;
            default:
                await this.playerCards.flyCard1(currentIndex);
                await this.bankerCards.flyCard1(currentIndex + 1);
                await this.playerCards.flyCard2(currentIndex + 2);
                await this.bankerCards.flyCard2(currentIndex + 3);
                await this.reserveCards.flyCard1(currentIndex + 4, this.reserveCards.durationFlyCard3);
                await this.reserveCards.flyCard2(currentIndex + 5, this.reserveCards.durationFlyCard3);
                break;
        }
    }

    public async collectCardsOnTable() {
        this.burnContainer?.handleDropCards();
        await Promise.all([
            this.bankerCards.dropCards(this.bankerCards.durationJumpDrop, this.bankerCards.durationDropCard),
            this.playerCards.dropCards(this.bankerCards.durationJumpDrop, this.bankerCards.durationDropCard)
        ]);
    }

    async flyCard3(playerHasCard3 = false, isFlyCard3Player = false) {
        if (isFlyCard3Player) {
            this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
        } else {
            this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card1]);
        }

        if (playerHasCard3) {
            await this.reserveCards.flyCard3(
                this.playerCards.cards[CardsOrder.card3],
                this.reserveCards.cards[CardsOrder.card1],
                this.reserveCards.durationFlyCard,
                false
            );
        } else {
            await this.reserveCards.flyCard3(
                this.bankerCards.cards[CardsOrder.card3],
                this.reserveCards.cards[CardsOrder.card1],
                this.reserveCards.durationFlyCard,
                true
            );
        }
    }

    showCardsWithoutAnimation(lastRound: BlockchainBaccaratRoundHistory, currentIndex: number, isShowCurrentResult = false) {
        const playerCards = Object.values(lastRound.result.player).filter((card) => card != null);
        const bankerCards = Object.values(lastRound.result.banker).filter((card) => card != null);
        const startIndex = currentIndex - playerCards.length - bankerCards.length;
        this.playerCards.showCardsWithoutAnimation({ cards: playerCards, startIndex, isShowCurrentResult });
        this.bankerCards.showCardsWithoutAnimation({
            cards: bankerCards,
            startIndex: startIndex + 1,
            lastIndex: currentIndex - 1,
            isShowCurrentResult
        });
        this.sesetReserveCards(lastRound);
        playerCards.length + bankerCards.length < 6 && this.updateReserceCardsIndex(startIndex);
    }

    sesetReserveCards(lastRound: BlockchainBaccaratRoundHistory) {
        if (lastRound.result.player?.card3 && lastRound.result.banker?.card3) {
            this.reserveCards?.resetCards();
            return;
        }
        if (lastRound.result.player?.card3 || lastRound.result.banker?.card3) {
            this.reserveCards?.resetCard(this.reserveCards.cards[CardsOrder.card1]);
        }

        return;
    }

    updateReserceCardsIndex(currentIndex: number) {
        this.reserveCards?.cards.forEach((card: cc.Node, index: number) => {
            const cardComponent: BlockchainCard = card?.getComponentInChildren(BlockchainCard);
            cardComponent?.setIndexNumber(currentIndex + index + 4);
        });
    }

    async handleShuffleCards(data: Blockchain, duration: number) {
        await this.collectCardsOnTable();
        this.reserveCards?.resetCards();
        this.burnContainer.node.active = true;
        this.setActiveCardsUI(false);
        await this.burnContainer.handleShowCutCards(data, duration);
    }

    setActiveCardsUI(isActive: boolean) {
        if (isActive) {
            GameUtils.showNode(this.reserveCards?.node);
            GameUtils.showNode(this.bankerCards?.node);
            GameUtils.showNode(this.playerCards?.node);
        } else {
            GameUtils.hideNode(this.reserveCards?.node);
            GameUtils.hideNode(this.bankerCards?.node);
            GameUtils.hideNode(this.playerCards?.node);
        }

        this.winningNotice.node.parent.active = false;
    }
}
