import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { BlockchainCardModel } from "../BlockchainBaccaratType";

export type Blockchain = {
    burnedCards: number;
    chain: BlockchainCardModel[];
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

    private _currentIndex: number;
    private _numberCardsFly = 6;
    blockchain: Blockchain;
    newBlockchain: Blockchain;

    set currentIndex(index: number) {
        this._currentIndex = index;
    }

    get currentIndex() {
        return this._currentIndex;
    }

    set numberCardsFly(count: number) {
        this._numberCardsFly = count;
    }

    get numberCardsFly() {
        return this._numberCardsFly;
    }

    change(blockchain: Blockchain) {
        const currentIndex = blockchain.currentIndex;
        this.blockchain = blockchain;
        this.currentIndex = currentIndex;
        this.emit(BlockchainBaccaratCardListModel.Events.CHANGE, blockchain);
    }

    changeCurrentIndexJoinRoom(currentIndex: number) {
        this.emit(BlockchainBaccaratCardListModel.Events.UPDATE_CURRENT_INDEX, currentIndex);
    }

    updateNewBlockchain(newBlockchain: Blockchain) {
        this.newBlockchain = newBlockchain;
        this.emit(BlockchainBaccaratCardListModel.Events.UPDATE_NEW_BLOCKCHAIN, newBlockchain);
    }

    calculateCardsFly(index: number) {
        this.numberCardsFly = index - this.currentIndex;
        this.currentIndex = index;
    }
}
