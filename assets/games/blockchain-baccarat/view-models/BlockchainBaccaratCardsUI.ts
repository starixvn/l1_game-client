import BlockchainBaccaratCards from "./card/BlockchainBaccaratCards";

const { ccclass, property } = cc._decorator;

enum CardsOrder {
    card1 = 0,
    card2,
    card3
}

type OrderCardValue = {
    node: BlockchainBaccaratCards;
    key: number;
};

enum CardFlied {
    Four = 4,
    Five,
    Six
}

@ccclass
export default class BlockchainBaccaratCardsUI extends cc.Component {
    @property(BlockchainBaccaratCards)
    bankerCards: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    playerCards: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    reserveCards: BlockchainBaccaratCards = null;

    @property(cc.Node)
    bankerPoint: cc.Node = null;

    @property(cc.Node)
    playerPoint: cc.Node = null;

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
            case CardFlied.Four:
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
                await this.reserveCards.flyCard1(currentIndex + 4);
                await this.reserveCards.flyCard2(currentIndex + 5);
                break;
            case CardFlied.Five:
                this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
                await this.reserveCards.flyCard1Reserve(
                    currentIndex,
                    this.playerCards.cards[CardsOrder.card1],
                    this.reserveCards.cards[CardsOrder.card2]
                );
                await this.bankerCards.flyCard1(currentIndex + 1);
                await this.playerCards.flyCard2(currentIndex + 2);
                await this.bankerCards.flyCard2(currentIndex + 3);
                await this.reserveCards.flyCard1(currentIndex + 4);
                await this.reserveCards.flyCard2(currentIndex + 5);
                break;
            default:
                await this.playerCards.flyCard1(currentIndex);
                await this.bankerCards.flyCard1(currentIndex + 1);
                await this.playerCards.flyCard2(currentIndex + 2);
                await this.bankerCards.flyCard2(currentIndex + 3);
                await this.reserveCards.flyCard1(currentIndex + 4);
                await this.reserveCards.flyCard2(currentIndex + 5);
                break;
        }
    }

    handleResetCards(numberCardsFlied: number) {
        switch (numberCardsFlied) {
            case CardFlied.Four:
                this.playerCards.resetCards();
                this.bankerCards.resetCards();
                break;
            case CardFlied.Five:
                this.playerCards.resetCards();
                this.bankerCards.resetCards();
                this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card1]);
                break;
            default:
                this.playerCards.resetCards();
                this.bankerCards.resetCards();
                this.reserveCards.resetCards();
                break;
        }
    }

    protected async flyCard3(playerHasCard3 = false) {
        if (playerHasCard3) {
            this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card1]);
            await this.reserveCards.flyCard3(this.playerCards.cards[CardsOrder.card3], this.reserveCards.cards[CardsOrder.card1]);
        } else {
            this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
            await this.reserveCards.flyCard3(this.bankerCards.cards[CardsOrder.card3], this.reserveCards.cards[CardsOrder.card2]);
        }
    }

    async onClick() {
        this.handleResetCards(6);
        this.handleFlyCards(1, 6);
    }

    async onClickFlyCard3() {
        this.resetCard3();
        this.flyCard3(true);
    }

    resetCard3() {
        this.playerCards.cards[CardsOrder.card3].rotation = 0;
        this.playerCards.cards[CardsOrder.card3].opacity = 0;
        this.bankerCards.cards[CardsOrder.card3].rotation = 0;
        this.bankerCards.cards[CardsOrder.card3].opacity = 0;
    }

    onClickDropCards() {
        this.collectCardsOnTable();
    }

    public async collectCardsOnTable() {
        await Promise.all([this.bankerCards.collectCards(), this.playerCards.collectCards()]);
    }

    async openCards() {
        const result = {
            player: {
                card1: {
                    rank: 8,
                    suit: 2
                },
                card2: {
                    rank: 7,
                    suit: 3
                },
                card3: {
                    rank: 9,
                    suit: 2
                }
            },
            banker: {
                card1: {
                    rank: 3,
                    suit: 2
                },
                card2: {
                    rank: 5,
                    suit: 2
                },
                card3: {
                    rank: 7,
                    suit: 2
                }
            },
            cards: [
                {
                    rank: 11,
                    suit: 2
                },
                {
                    rank: 3,
                    suit: 2
                },
                {
                    rank: 11,
                    suit: 3
                },
                {
                    rank: 5,
                    suit: 2
                },
                {
                    rank: 9,
                    suit: 2
                },
                {
                    rank: 1,
                    suit: 1
                }
            ]
        };
        await this.playerCards.openCard(CardsOrder.card1, this.playerCards.cards[CardsOrder.card1], result.player.card1, true);
        await this.playerCards.openCard(CardsOrder.card2, this.playerCards.cards[CardsOrder.card2], result.player.card2, true);

        await this.bankerCards.openCard(CardsOrder.card1, this.bankerCards.cards[CardsOrder.card1], result.banker.card1, true);
        await this.bankerCards.openCard(CardsOrder.card2, this.bankerCards.cards[CardsOrder.card2], result.banker.card2, true);

        if (!!result.player.card3) {
            await this.flyCard3(true);
            await this.playerCards.openCard(CardsOrder.card3, this.playerCards.cards[CardsOrder.card3], result.player.card3, true);
        }

        if (!!result.banker.card3) {
            await this.flyCard3();
            await this.bankerCards.openCard(CardsOrder.card3, this.bankerCards.cards[CardsOrder.card3], result.banker.card3, true);
        }
    }

    async onSettle4Card() {
        this.openCards();
    }
}
