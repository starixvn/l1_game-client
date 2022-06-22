import BaccaratTimeDataHandler from "../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export class BlockchainBaccaratTimeHandler extends BaccaratTimeDataHandler {
    protected dealCardsTime = 3;
    private durationNewShoe = 10;
    private durationShowNewShoe = this.main.config.fullTime - this.dealCardsTime;
    private isNewShoe = false;
    private isShowShoe = false;

    get isInWaitTime() {
        if (this.main.currentTimeRemaining > this.main.config.fullTime) {
            this.isNewShoe = true;
            return true;
        } else {
            return this.main.currentTimeRemaining > this.main.config.betTime + this.dealCardsTime;
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
                    blockchainBaccarat.scoreboard.resetScoreboard();
                    blockchainBaccarat.lastRoundIfo.reset();
                    blockchainBaccarat.gameData.finishModel.clear();
                    const gameData = blockchainBaccarat.gameData;
                    const cardContainer = blockchainBaccarat.cardsUI;
                    cardContainer.handleShuffleCards(gameData.cardList.newBlockchain, blockchainBaccarat.currentTimeRemaining);
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
}
