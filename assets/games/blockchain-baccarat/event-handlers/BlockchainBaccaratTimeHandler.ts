import BaccaratTimeDataHandler from "../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import { BlockchainBaccaratRoundHistory } from "../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import BlockchainBaccaratCards from "../view-models/card/BlockchainBaccaratCards";

export type CardPrepare = {
    component: BlockchainBaccaratCards;
    des?: any;
    start?: any;
    delay: number;
};

export default class BlockchainBaccaratTimeHandler extends BaccaratTimeDataHandler {
    protected getOwnMain(): BlockchainBaccarat {
        return this.main as BlockchainBaccarat;
    }

    async handleFlyCards() {
        const blockchainBaccarat: BlockchainBaccarat = this.getOwnMain();
        const gameData = blockchainBaccarat.gameData;
        const currentCardIndex = gameData.cardList.currentIndex;
        const numberCardsFlied = gameData.cardList.numberCardsFly;
        const cardContainer = blockchainBaccarat.cardsUI;

        await cardContainer.collectCardsOnTable();
        const lastRound = gameData.finishModel.finishData ?? gameData.roundHistory.list[0];
        blockchainBaccarat.lastRoundIfo.updateUI(lastRound, currentCardIndex);
        await cardContainer.handleFlyCards(currentCardIndex, numberCardsFlied);
    }

    handleInLockBetTime() {
        const main = this.getOwnMain();
        main.scoreboard.renderNextNode();
        this.main.betItems.forEach((item) => item.setHighlight(false));
        // super.handleInLockBetTime();
    }
}
