import { BlockchainBaccaratBetType } from "./../event-models/BlockchainBaccaratBetPercentageModel";
import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";

export type BlockchainBaccaratBetPercentage<Choices> = {
    betPercentage: BlockchainBaccaratBetType;
};

export class BlockchainBaccaratBetPercentageHandler<Choices> extends BaseEventHandler<BlockchainBaccaratBetPercentage<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratBetPercentage<Choices>) {
        return event.betPercentage != null;
    }

    protected handle(event: BlockchainBaccaratBetPercentage<Choices>) {
        this.gameData.betPercentage.change(event.betPercentage);
    }
}
