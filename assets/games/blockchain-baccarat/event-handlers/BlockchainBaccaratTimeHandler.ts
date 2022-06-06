import BaccaratTimeDataHandler from "../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import BlockchainBaccaratCardsUI from "../view-models/BlockchainBaccaratCardsUI";

enum CardsOrder {
    card1 = 0,
    card2,
    card3
}

export default class BlockchainBaccaratTimeHandler extends BaccaratTimeDataHandler {
    protected getOwnMain(): any {
        return this.main as BlockchainBaccarat;
    }

    async handleFlyCards() {
        const blockchainBaccarat: BlockchainBaccarat = this.getOwnMain();
        const cardContainer = blockchainBaccarat.cardsUI;
        cardContainer.bankerCard.resetCards();
        cardContainer.playerCard.resetCards();
        cardContainer.tmpCard.resetCards.bind(this);
        await this.flyCards(cardContainer);
    }

    handleInLockBetTime() {
        // super.handleInLockBetTime();
    }

    async flyCards(cardContainer: BlockchainBaccaratCardsUI) {
        const cardListBanker = cardContainer.bankerCard.cards;
        const cardListPlayer = cardContainer.playerCard.cards;
        const cardListTmp = cardContainer.tmpCard.cardsTmp;
        const player = cardContainer.playerCard;
        const banker = cardContainer.bankerCard;
        const cardTmp = cardContainer.tmpCard;

        await player.flyCard(cardListPlayer[CardsOrder.card1], 0.1);
        await banker.flyCard(cardListBanker[CardsOrder.card1], 0.4);
        await player.flyCard(cardListPlayer[CardsOrder.card2], 0.4);
        await banker.flyCard(cardListBanker[CardsOrder.card2], 0.4);
        await cardTmp.flyCard(cardListTmp[CardsOrder.card1], 0.2);
        await cardTmp.flyCard(cardListTmp[CardsOrder.card2], 0.2);
    }
}
