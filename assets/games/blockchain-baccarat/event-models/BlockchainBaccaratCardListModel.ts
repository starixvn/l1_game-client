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

    change(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.emit(BlockchainBaccaratCardListModel.Events.CHANGE, blockchain);
    }
}
