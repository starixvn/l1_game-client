import { Blockchain } from "./BlockchainBaccaratCardListModel";
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { BlockchainBaccaratChoicesType, CardValue } from "../BlockchainBaccaratType";

export type CardChainResult = {
    player: CardValue;
    banker: CardValue;
};

export type BlockchainBaccaratFinish = {
    result: CardChainResult;
    settlementResult: BlockchainBaccaratChoicesType;
    winningPlayers: any[];
    roundId: number;
    blockchain: Blockchain;
};

export class BlockchainBaccaratFinishModel extends EventEmitterBase {
    static Events = {
        CHANGE_SETTLEMENT: "settlement:change",
        SHOWED_ANIMATION: "animation:showed"
    };

    finishData: BlockchainBaccaratFinish;

    changeFinishResult(finish: BlockchainBaccaratFinish) {
        this.finishData = finish;
        this.emit(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, this);
    }

    finishAnimationWinning() {
        this.emit(BlockchainBaccaratFinishModel.Events.SHOWED_ANIMATION, this);
    }
}
