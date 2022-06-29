import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { Chain } from "../BlockchainBaccaratType";

export type Blockchain = {
    burnedCards: number;
    chain: Chain[];
    currentIndex: number;
    cutCardIndex: number;
    isNew?: boolean;
};

export class BlockchainBaccaratCardListModel extends EventEmitterBase {
    static Events = {
        CHANGE: "cardList:change",
        UPDATE_NEW_BLOCKCHAIN: "cardList:updateNewBlockchain",
        UPDATE_CURRENT_INDEX: "cardList:updateCurrentIndex"
    };

    blockchain: Blockchain;
    newBlockchain: Blockchain;
    currentIndex: number;
    numberCardsFly = 6;

    change(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.currentIndex = blockchain.currentIndex;
        console.log(blockchain.currentIndex, "blockchain.currentIndex");
        this.emit(BlockchainBaccaratCardListModel.Events.CHANGE, blockchain);
    }

    updateNewBlockchain(newBlockchain: Blockchain) {
        this.newBlockchain = newBlockchain;
        this.emit(BlockchainBaccaratCardListModel.Events.UPDATE_NEW_BLOCKCHAIN, newBlockchain);
    }

    handleCurrentIndex(index: number) {
        this.numberCardsFly = index - this.currentIndex;
        this.currentIndex = index;
    }

    changeCurrentIndex(currentIndex: number) {
        this.emit(BlockchainBaccaratCardListModel.Events.UPDATE_CURRENT_INDEX, currentIndex);
    }

    changeNumberCardsFly(cardFlied: number) {
        this.numberCardsFly = cardFlied;
    }

    updateCurrentIndex(index: number) {
        this.currentIndex = index;
    }
}
