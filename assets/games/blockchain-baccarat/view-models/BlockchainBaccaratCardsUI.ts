import { BlockchainBaccaratRoundHistory } from "../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratCardsShuffle from "./card-shuffle/BlockchainBaccaratCardsShuffle";
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

    @property(BlockchainBaccaratCardsShuffle)
    burnContainer: BlockchainBaccaratCardsShuffle = null;

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
        this.sesetReserveCards(lastRound);
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

    async onClickBurnCards() {
        // this.burnContainer.handleShowBurnCard();
    }

    onClickDrop() {
        // onClickDrop
        this.burnContainer.handleDropCards();
    }

    async onClickAnim() {
        //onClickAnim

        const data = {
            currentIndex: 6,
            cutCardIndex: 250,
            burnedCards: 8,
            firstRoundId: 82396,
            chain: [
                {
                    rawValue: "5♥_2022-06-17T06:36:20.062Z_N/A_bd67e27b-b2dd-42a4-9c22-b22533888023",
                    hashValue: "5815c3bb72bcaff1f22f9dce48404b8164fdc9ccda89b2bcb45aafcf7653d724",
                    card: {
                        rank: 4,
                        suit: 0
                    },
                    revealedRawValue: "23"
                },
                {
                    rawValue:
                        "2♦_2022-06-17T06:36:20.062Z_5815c3bb72bcaff1f22f9dce48404b8164fdc9ccda89b2bcb45aafcf7653d724_7b8ea76a-3744-4bbb-8e85-10e417e6a56d",
                    hashValue: "438fd3da237792334a720a87ed09ab2351f6d49e2447320d2b0a3f75818903fb",
                    card: {
                        rank: 1,
                        suit: 1
                    },
                    revealedRawValue: "6d"
                },
                {
                    rawValue:
                        "3♠_2022-06-17T06:36:20.062Z_438fd3da237792334a720a87ed09ab2351f6d49e2447320d2b0a3f75818903fb_eabc74a4-5f96-4596-8d44-07da9f351c2b",
                    hashValue: "98c4267a76a7fc551a215c302bf2607dce8c197c847ca33bc0c40027ade98ade",
                    card: {
                        rank: 2,
                        suit: 3
                    },
                    revealedRawValue: "2b"
                },
                {
                    rawValue:
                        "4♣_2022-06-17T06:36:20.062Z_98c4267a76a7fc551a215c302bf2607dce8c197c847ca33bc0c40027ade98ade_c1a6a21e-8529-4f9d-9402-0ce1dd862d29",
                    hashValue: "2c64e457414ef003032c2825d4432c249c34a9dabf8f97d06a28454f54304a4a",
                    card: {
                        rank: 3,
                        suit: 2
                    },
                    revealedRawValue: "29"
                },
                {
                    rawValue:
                        "5♦_2022-06-17T06:36:20.062Z_2c64e457414ef003032c2825d4432c249c34a9dabf8f97d06a28454f54304a4a_3ffd88ce-aa5b-4784-99c9-1e900d44fe12",
                    hashValue: "b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07",
                    card: {
                        rank: 4,
                        suit: 1
                    },
                    revealedRawValue: "12"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    rawValue:
                        "6♦_2022-06-17T06:36:20.062Z_b1b5d2753a019a7f35823d967ab41f9adc462b2f0c8dbbb36d79f89cde36ab07_31710001-5022-474d-b14b-72508c9502d2",
                    hashValue: "62423f8d7ed4951cdd55382ee8cf5fd7e47d78cbc75b7c37508c3b6a3c4545ca",
                    card: {
                        rank: 5,
                        suit: 1
                    },
                    revealedRawValue: "d2"
                },
                {
                    hashValue: "f4352d58cf16017fd7cce5ffe28593e930813be1b0362a3d9cc3dbbceb0c7bec",
                    revealedRawValue: "b7"
                },
                {
                    hashValue: "1b8bf6652ee7f81334e2cf2c894155a7d0667fb5ff7a8583171fe86e42cc5bc1",
                    revealedRawValue: "f2"
                }
            ]
        };
        this.burnContainer.node.active = true;
        this.setActiveCardsUI(false);
        await this.burnContainer.handleShowCutCards(data, true);
        this.setActiveCardsUI(true);
    }

    setActiveCardsUI(isActive = true) {
        this.reserveCards.node.active = isActive;
        this.bankerCards.node.active = isActive;
        this.playerCards.node.active = isActive;
    }
}
