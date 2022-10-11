import { History } from "../../_new/_base/game-data-management/models/history";
import { FruitSlotRoundHistory } from "./FruitSlotRoundHistory";

export class FruitSlotRoundHistoryModel extends History<FruitSlotRoundHistory> {
    static RoundHistoryEvents = {
        CHANGE: "RoundHistory:change"
    };

    protected dispatchChangeEvent() {
        super.dispatchChangeEvent();
        this.emit(FruitSlotRoundHistoryModel.RoundHistoryEvents.CHANGE, this);
    }

    fifo(model: FruitSlotRoundHistory) {
        if (this.data && this.data.length && this.data[0].roundId === model.roundId) {
            return;
        }

        super.fifo(model);
    }
}
