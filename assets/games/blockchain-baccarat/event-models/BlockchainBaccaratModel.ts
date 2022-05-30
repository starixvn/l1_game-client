import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export type BlockchainBaccarat = {
    burnedCards: number;
    chain: string[];
    currentIndex: number;
    cutCardIndex: number;
};

export default class BlockchainBaccaratModel extends EventEmitterBase {
    static Events = {
        CHANGE: "configs:change"
    };

    blockchain: BlockchainBaccarat;

    change(blockchain: BlockchainBaccarat) {
        this.blockchain = blockchain;
        this.emit(BlockchainBaccaratModel.Events.CHANGE, blockchain);
    }
}
