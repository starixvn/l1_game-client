import { BlockchainBaccaratRoundHistory } from "../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratCards from "./card/BlockchainBaccaratCards";

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

    protected orderCard: OrderCardValue[];

    onLoad() {
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
                this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card1]);
                await this.reserveCards.flyCard1Reserve(
                    currentIndex,
                    this.playerCards.cards[CardsOrder.card1],
                    this.reserveCards.cards[CardsOrder.card1]
                );
                this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
                await this.reserveCards.flyCard1Reserve(
                    currentIndex + 1,
                    this.bankerCards.cards[CardsOrder.card1],
                    this.reserveCards.cards[CardsOrder.card2]
                );
                await this.playerCards.flyCard2(currentIndex + 2);
                await this.bankerCards.flyCard2(currentIndex + 3);
                await this.reserveCards.flyCard1(currentIndex + 4, this.reserveCards.durationFlyCard3);
                await this.reserveCards.flyCard2(currentIndex + 5, this.reserveCards.durationFlyCard3);
                break;
            case CountCardFlied.FiveCards:
                this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
                await this.reserveCards.flyCard1Reserve(
                    currentIndex,
                    this.playerCards.cards[CardsOrder.card1],
                    this.reserveCards.cards[CardsOrder.card2]
                );
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
                this.reserveCards.durationFlyCard
            );
        } else {
            await this.reserveCards.flyCard3(
                this.bankerCards.cards[CardsOrder.card3],
                this.reserveCards.cards[CardsOrder.card1],
                this.reserveCards.durationFlyCard
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

        this.reserveCards?.resetCards();
    }
}
