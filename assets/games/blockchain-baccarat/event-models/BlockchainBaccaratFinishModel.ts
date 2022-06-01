import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { BlockchainBaccaratResult } from "./BlockchainBaccaratResult";

export class BlockchainBaccaratFinishModel extends EventEmitterBase {
    static Events = {
        CHANGE_SETTLEMENT: "settlement:change",
        SHOWED_ANIMATION: "animation:showed"
    };

    settlementResult: BlockchainBaccaratResult;

    changeSettlementResult(settlementResult: BlockchainBaccaratResult) {
        this.settlementResult = settlementResult;
        this.emit(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, this);
    }

    finishAnimationWinning() {
        this.emit(BlockchainBaccaratFinishModel.Events.SHOWED_ANIMATION, this);
    }
}
