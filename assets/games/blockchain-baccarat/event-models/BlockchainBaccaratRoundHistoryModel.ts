import { HistoryBase } from "../../_base/view-models/HistoryBase";
import { BlockchainBaccaratRoundHistory } from "./BlockchainBaccaratRoundHistory";

export default class BlockchainBaccaratRoundHistoryModel extends HistoryBase<BlockchainBaccaratRoundHistory> {
    static RoundHistoryEvents = {
        CHANGE: "RoundHistory:change",
        CLEAR: "RoundHistory:clear"
    };

    protected dispatchChangeEvent() {
        super.dispatchChangeEvent();
        this.emit(BlockchainBaccaratRoundHistoryModel.RoundHistoryEvents.CHANGE, this);
    }

    clear() {
        super.cleanWithoutTriggerEvent();
        this.emit(BlockchainBaccaratRoundHistoryModel.RoundHistoryEvents.CLEAR);
    }

    fifo(model: BlockchainBaccaratRoundHistory) {
        if (this.data && this.data.length && this.data[0].roundId === model.roundId) {
            return;
        }

        super.fifo(model);
    }
}
