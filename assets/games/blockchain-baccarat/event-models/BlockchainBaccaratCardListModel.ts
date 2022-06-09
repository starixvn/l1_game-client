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
        CHANGE: "configs:change"
    };

    blockchain: Blockchain;
    currentIndex: number;
    numberCardsFly = 6;

    change(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.currentIndex = blockchain.currentIndex;
        console.log(blockchain.currentIndex, "blockchain.currentIndex");
        this.emit(BlockchainBaccaratCardListModel.Events.CHANGE, blockchain);
    }

    handleCurrentIndex(index: number) {
        this.numberCardsFly = index - this.currentIndex;
        console.log(this.numberCardsFly, "numberCardsFly");
        this.currentIndex = index;
    }
}
