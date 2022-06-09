import BlockchainBaccaratCards from "./card/BlockchainBaccaratCards";

const { ccclass, property } = cc._decorator;

enum CardsOrder {
    card1 = 0,
    card2,
    card3
}

type OrderCard = {
    node: BlockchainBaccaratCards;
    key: number;
};

enum CardFly {
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

    protected orderCard: OrderCard[];

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
            case CardFly.Four:
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
            case CardFly.Five:
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
            case CardFly.Four:
                this.playerCards.resetCards();
                this.bankerCards.resetCards();
                break;
            case CardFly.Five:
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

    protected async flyCard3(playerHasCard3: boolean, delayTime = this.playerCards.openSecondCardSecond) {
        if (playerHasCard3) {
            this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card1]);
            await this.reserveCards.flyCard3(this.playerCards.cards[CardsOrder.card3], this.reserveCards.cards[CardsOrder.card1]);
            await this.playerCards.openCard3(this.playerCards.cards[CardsOrder.card3], 0.2);
        }

        this.reserveCards.resetCard(this.reserveCards.cards[CardsOrder.card2]);
        await this.reserveCards.flyCard3(this.bankerCards.cards[CardsOrder.card3], this.reserveCards.cards[CardsOrder.card2]);
        await this.playerCards.openCard3(this.bankerCards.cards[CardsOrder.card3], 0.2);
        // openCard3()
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
        //onClickDropCards
        // this.bankerCards.collectCards();
        // this.playerCards.collectCards();
        this.collectCardsOnTable();
    }

    public async collectCardsOnTable() {
        await Promise.all([this.bankerCards.collectCards(), this.playerCards.collectCards()]);
    }
}
