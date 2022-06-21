import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccaratRoundHistory } from "../event-models/BlockchainBaccaratRoundHistory";

export type BlockchainBaccaratRoundHistoryType<Choices> = {
    roundHistory: BlockchainBaccaratRoundHistory[];
};

export class BlockchainBaccaratRoundHistoryHandler<Choices> extends BaseEventHandler<BlockchainBaccaratRoundHistoryType<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratRoundHistoryType<Choices>) {
        return event.roundHistory && event.roundHistory.length !== 0;
    }

    protected handle(event: BlockchainBaccaratRoundHistoryType<Choices>) {
        this.gameData.roundHistory.cleanWithoutTriggerEvent();
        this.gameData.roundHistory.push(...event.roundHistory);
    }
}
