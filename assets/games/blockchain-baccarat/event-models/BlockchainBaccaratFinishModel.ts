import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { BlockchainBaccaratChoicesType } from "../BlockchainBaccaratType";

export class BlockchainBaccaratFinishModel extends EventEmitterBase {
    static Events = {
        CHANGE_SETTLEMENT: "settlement:change",
        SHOWED_ANIMATION: "animation:showed"
    };

    settlementResult: BlockchainBaccaratChoicesType;

    changeSettlementResult(settlementResult: BlockchainBaccaratChoicesType) {
        this.settlementResult = settlementResult;
        this.emit(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, this);
    }

    finishAnimationWinning() {
        this.emit(BlockchainBaccaratFinishModel.Events.SHOWED_ANIMATION, this);
    }
}
