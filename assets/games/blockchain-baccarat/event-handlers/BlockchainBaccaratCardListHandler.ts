import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccarat } from "../event-models/BlockchainBaccaratCardListModel";
import { CardChain } from "../BlockchainBaccaratType";

export type BlockchainBaccaratCardListType<Choices> = {
    blockchain: {
        burnedCards: number;
        currentIndex: number;
        cutCardIndex: number;
        chain: CardChain[];
    };
};

export default class BlockchainBaccaratCardListHandler<Choices> extends BaseEventHandler<BlockchainBaccaratCardListType<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratCardListType<Choices>) {
        return event.blockchain != null;
    }

    protected handle(event: BlockchainBaccaratCardListType<Choices>) {
        this.gameData.cardList.change(event.blockchain as BlockchainBaccarat);
    }
}
