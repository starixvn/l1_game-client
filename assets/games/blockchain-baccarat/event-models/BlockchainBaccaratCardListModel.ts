import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { CardChain } from "../BlockchainBaccaratType";

export type Blockchain = {
    burnedCards: number;
    chain: CardChain[];
    currentIndex: number;
    cutCardIndex: number;
};

export default class BlockchainBaccaratCardListModel extends EventEmitterBase {
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
        console.log(this.numberCardsFly, "numberCardsFly");
        this.currentIndex = index;
    }

    changeCurrentIndex(blockchain: Blockchain) {
        this.emit(BlockchainBaccaratCardListModel.Events.UPDATE_CURRENT_INDEX, blockchain);
    }
}
