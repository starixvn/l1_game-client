import BaccaratTimeDataHandler from "../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import BlockchainBaccaratCards from "../view-models/card/BlockchainBaccaratCards";

export type CardPrepare = {
    component: BlockchainBaccaratCards;
    des?: any;
    start?: any;
    delay: number;
};

export class BlockchainBaccaratTimeHandler extends BaccaratTimeDataHandler {
    protected dealCardsTime = 3;
    protected durationNewShoe = 10;
    protected durationShowNewShoe = this.main.config.fullTime - this.dealCardsTime;
    isNewShoe = false;
    isShowShoe = false;

    get isInWaitTime() {
        if (this.main.currentTimeRemaining > this.main.config.fullTime) {
            this.isNewShoe = true;
            return true;
        } else {
            return this.main.currentTimeRemaining > this.main.config.betTime + this.dealCardsTime; // > 33
        }
    }

    protected getOwnMain(): BlockchainBaccarat {
        return this.main as BlockchainBaccarat;
    }

    handleWaitTime() {
        if (this.main.timeWaitNode) {
            if (this.isNewShoe && this.main.currentTimeRemaining === this.durationShowNewShoe) {
                if (!this.isShowShoe) {
                    this.isShowShoe = true;
                    this.main.resetDataAndUI();
                    const blockchainBaccarat: BlockchainBaccarat = this.getOwnMain();
                    const gameData = blockchainBaccarat.gameData;
                    const cardContainer = blockchainBaccarat.cardsUI;
                    const onCollectedCards = () => {
                        const lastRound = gameData.finishModel.finishData;
                        const currentCardIndex = gameData.cardList.currentIndex;
                        blockchainBaccarat.lastRoundIfo.updateUI(lastRound, currentCardIndex);
                    };
                    cardContainer.handleShuffleCards(
                        gameData.cardList.newBlockchain,
                        blockchainBaccarat.currentTimeRemaining,
                        onCollectedCards
                    );
                }
            } else {
                this.main.finishShowResult && this.showWaitTime();
            }
        }

        this.showMainTime(false);
        this.main.showProcessingWarning(false);
        this.main.setGameRound(this.main.roundId - 1);
    }

    handleNotWaitTime() {
        if (this.isStartingNewGameRound && this.isShowShoe) {
            this.isShowShoe = false;
            this.clearInfo();
        }
        this.isNewShoe = false;
        super.handleNotWaitTime();
    }

    showWaitTime() {
        if (this.isNewShoe && this.main.currentTimeRemaining <= this.durationShowNewShoe + 1) {
            this.main.timeWaitNode.active = false;
        } else {
            this.main.timeWaitNode.active = true;
        }

        this.main.timeWaitLabel.string = this.formatTime(
            this.main.currentTimeRemaining - this.main.config.betTime - this.dealCardsTime - 1 - (this.isNewShoe ? this.durationNewShoe : 0)
        );
    }

    async handleFlyCards() {
        const blockchainBaccarat: BlockchainBaccarat = this.getOwnMain();
        const gameData = blockchainBaccarat.gameData;
        const currentCardIndex = gameData.cardList.currentIndex;
        const numberCardsFlied = gameData.cardList.numberCardsFly;
        const cardContainer = blockchainBaccarat.cardsUI;

        cardContainer.setActiveCardsUI(true);
        await cardContainer.collectCardsOnTable();
        const lastRound = gameData.finishModel.finishData ?? gameData.roundHistory.list[0];
        blockchainBaccarat.lastRoundIfo.updateUI(lastRound, currentCardIndex);
        await cardContainer.handleFlyCards(currentCardIndex, numberCardsFlied);
    }

    handleInLockBetTime() {
        const main = this.getOwnMain();
        main.scoreboard?.renderNextNode();
        this.main.betItems.forEach((item) => item.setHighlight(false));
    }

    clearInfo() {
        const blockchainBaccarat = this.getOwnMain();
        blockchainBaccarat.scoreboard.resetScoreboard();
        blockchainBaccarat.lastRoundIfo.reset();
        blockchainBaccarat.gameData.finishModel.clear();
    }
}
