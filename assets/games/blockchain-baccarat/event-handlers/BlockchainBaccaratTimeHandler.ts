import BaccaratTimeDataHandler from "../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import BlockchainBaccaratCards from "../view-models/card/BlockchainBaccaratCards";

export type CardPrepare = {
    component: BlockchainBaccaratCards;
    des?: any;
    start?: any;
    delay: number;
};

export default class BlockchainBaccaratTimeHandler extends BaccaratTimeDataHandler {
    protected getOwnMain(): any {
        return this.main as BlockchainBaccarat;
    }

    async handleFlyCards() {
        const blockchainBaccarat: BlockchainBaccarat = this.getOwnMain();
        const currentCardIndex = blockchainBaccarat.gameData.cardList.currentIndex;
        const numberCardsFlied = blockchainBaccarat.gameData.cardList.numberCardsFly;
        const cardContainer = blockchainBaccarat.cardsUI;
        cardContainer.handleFlyCards(currentCardIndex, numberCardsFlied);
        cardContainer.handleResetCards(numberCardsFlied);
    }

    handleInLockBetTime() {
        // super.handleInLockBetTime();
    }
}
