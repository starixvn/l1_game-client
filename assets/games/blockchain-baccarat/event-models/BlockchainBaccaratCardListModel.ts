import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { CardChain } from "../BlockchainBaccaratType";

export type BlockchainBaccarat = {
    burnedCards: number;
    chain: CardChain[];
    currentIndex: number;
    cutCardIndex: number;
};

export default class BlockchainBaccaratCardListModel extends EventEmitterBase {
    static Events = {
        CHANGE: "configs:change"
    };

    blockchain: BlockchainBaccarat;

    change(blockchain: BlockchainBaccarat) {
        this.blockchain = blockchain;
        this.emit(BlockchainBaccaratCardListModel.Events.CHANGE, blockchain);
    }
}
