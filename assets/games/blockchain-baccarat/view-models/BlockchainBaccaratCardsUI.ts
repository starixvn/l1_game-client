import BlockchainBaccaratCards from "./card/BlockchainBaccaratCards";

const { ccclass, property } = cc._decorator;

enum CardsOrder {
    card1 = 0,
    card2,
    card3
}

@ccclass
export default class BlockchainBaccaratCardsUI extends cc.Component {
    @property(BlockchainBaccaratCards)
    bankerCard: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    playerCard: BlockchainBaccaratCards = null;

    @property(BlockchainBaccaratCards)
    tmpCard: BlockchainBaccaratCards = null;

    @property(cc.Node)
    bankerPoint: cc.Node = null;

    @property(cc.Node)
    playerPoint: cc.Node = null;

    onLoad() {
        // this.playerCard.cards.forEach((card) => {
        //     this.playerCard.resetCard(card);
        // });
        // this.bankerCard.cards.forEach((card) => {
        //     this.bankerCard.resetCard(card);
        // });
    }

    async onClick() {
        this.bankerPoint.active = false;
        this.playerPoint.active = false;
        const cardListBanker = this.bankerCard.cards;
        const cardListPlayer = this.playerCard.cards;
        const player = this.playerCard;
        const banker = this.bankerCard;
        console.log(cardListPlayer[CardsOrder.card1].position);
        console.log(cardListBanker[CardsOrder.card1].position);
        player.resetCard(cardListPlayer[CardsOrder.card1]);
        // await player.flyCard(cardListPlayer[CardsOrder.card1], 1);
        // await banker.flyCard(cardListBanker[CardsOrder.card1], 2);
        // await player.flyCard(cardListPlayer[CardsOrder.card2], 3);
        // await banker.flyCard(cardListBanker[CardsOrder.card2], 4);
    }
}
