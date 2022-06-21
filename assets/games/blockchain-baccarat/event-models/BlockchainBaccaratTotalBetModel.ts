import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export type BlockchainBaccaratTotalBetType = {
    banker?: number;
    bankerPair?: number;
    big?: number;
    player?: number;
    playerPair?: number;
    small?: number;
    tie?: number;
};

export class BlockchainBaccaratTotalBetModel extends EventEmitterBase {
    static Events = {
        CHANGE: "totalBet:change"
    };

    totalBet: BlockchainBaccaratTotalBetType;

    change(totalBet: BlockchainBaccaratTotalBetType) {
        this.totalBet = totalBet;
        this.emit(BlockchainBaccaratTotalBetModel.Events.CHANGE, this.totalBet);
    }
}
