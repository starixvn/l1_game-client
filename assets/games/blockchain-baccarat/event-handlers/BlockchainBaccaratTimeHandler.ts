import { Blockchain } from "./../event-models/BlockchainBaccaratCardListModel";
import { clearPercentBet } from "./../actions/BlockchainBaccaratTotalBetAction";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import BlockchainBaccaratBetItem from "../view-models/BlockchainBaccaratBetItem";
import BaccaratTimeDataBaseHandler from "../../_baccarat/data-handler/BaccaratTimeDataBaseHandler";

export class BlockchainBaccaratTimeHandler extends BaccaratTimeDataBaseHandler {
    protected dealCardsTime = 3;
    private readonly durationNewShoe = 10;
    private readonly durationShowNewShoe = this.main.config.fullTime - this.dealCardsTime;
    private _isNewShoe = false;
    private _isShowShoe = false;
    private _isResetUI = false;

    set isNewShoe(status: boolean) {
        this._isNewShoe = status;
    }

    get isNewShoe() {
        return this._isNewShoe;
    }

    set isShowShoe(status: boolean) {
        this._isShowShoe = status;
    }

    get isShowShoe() {
        return this._isShowShoe;
    }

    set isResetUI(status: boolean) {
        this._isResetUI = status;
    }

    get isResetUI() {
        return this._isResetUI;
    }

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
            const blockchainBaccarat: BlockchainBaccarat = this.getOwnMain();
            const gameData = blockchainBaccarat.gameData;
            if (this.isNewShoe && this.main.currentTimeRemaining <= this.durationShowNewShoe) {
                !this.isShowShoe &&
                    this.handleShowShuffleCards(blockchainBaccarat, gameData.cardList.newBlockchain, this.main.currentTimeRemaining);
            } else {
                if (gameData.cardList.blockchain.isNew && !this.isShowShoe) {
                    this.handleShowShuffleCards(blockchainBaccarat, gameData.cardList.blockchain, this.main.currentTimeRemaining);
                    return;
                }
                !gameData.cardList.blockchain.isNew && this.main.finishShowResult && this.showWaitTime();
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
        this.isResetUI && cardContainer.setActiveCardsUI(true);

        await cardContainer.collectCardsOnTable();
        cardContainer.updateCardDropBox(currentCardIndex, gameData.cardList.blockchain.cutCardIndex);
        const lastRound = gameData.finishModel.finishData ?? gameData.roundHistory.list[0];
        blockchainBaccarat.lastRoundIfo.updateUI(lastRound, currentCardIndex);
        clearPercentBet(blockchainBaccarat.betItems as BlockchainBaccaratBetItem[]);
        await cardContainer.handleFlyCards(currentCardIndex, numberCardsFlied);
        this.isResetUI = false;
    }

    handleInLockBetTime() {
        const main = this.getOwnMain();
        main.scoreboard?.renderNextNode();
        this.main.betItems.forEach((item) => item.setHighlight(false));
    }

    handleShowShuffleCards(blockchainBaccarat: BlockchainBaccarat, blockchainData: Blockchain, timeRemaining: number) {
        this.isShowShoe = true;
        this.isResetUI = true;
        this.main.resetDataAndUI();
        blockchainBaccarat.scoreboard.resetScoreboard();
        blockchainBaccarat.lastRoundIfo.reset();
        blockchainBaccarat.gameData.finishModel.clear();
        const cardContainer = blockchainBaccarat.cardsUI;

        blockchainData && cardContainer.handleShuffleCards(blockchainData, timeRemaining);
    }
}
