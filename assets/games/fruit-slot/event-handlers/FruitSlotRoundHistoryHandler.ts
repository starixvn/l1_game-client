import { FruitSlotResult, FruitSlotSettlementResult } from "./../FruitSlotType";
import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import FruitSlotGameData from "../event-models/FruitSlotGameData";

export type FruitSlotRoundHistory = {
    roundId: number;
    result: FruitSlotResult;
    settlementResult: FruitSlotSettlementResult;
};
type FruitSlotRoundHistoryType = {
    roundHistory: FruitSlotRoundHistory[];
};

export class FruitSlotRoundHistoryHandler extends BaseEventHandler<FruitSlotRoundHistoryType> {
    protected readonly gameData: FruitSlotGameData;

    protected verifyEvent(event: FruitSlotRoundHistoryType) {
        return event.roundHistory && event.roundHistory.length !== 0;
    }

    protected handle(event: FruitSlotRoundHistoryType) {
        this.gameData.roundHistory.cleanWithoutTriggerEvent();
        this.gameData.roundHistory.push(...event.roundHistory);
    }
}
