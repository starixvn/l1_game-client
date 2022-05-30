import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccarat } from "../event-models/BlockchainBaccaratModel";

export type BlockchainBaccaratType<Choices> = {
    blockchain: {
        burnedCards: number;
        currentIndex: number;
        cutCardIndex: number;
        chain: string[];
    };
};

export default class BlockchainBaccaratHandler<Choices> extends BaseEventHandler<BlockchainBaccaratType<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratType<Choices>) {
        return event.blockchain != null;
    }

    protected handle(event: BlockchainBaccaratType<Choices>) {
        this.gameData.blockchain.change(event.blockchain as BlockchainBaccarat);
    }
}
