import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import { Chain } from "../BlockchainBaccaratType";

export type BlockchainBaccaratCardListType<Choices> = {
    blockchain: {
        burnedCards: number;
        currentIndex: number;
        cutCardIndex: number;
        chain: Chain[];
        isNew: boolean;
    };
};

export class BlockchainBaccaratCardListHandler<Choices> extends BaseEventHandler<BlockchainBaccaratCardListType<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratCardListType<Choices>) {
        return event.blockchain != null;
    }

    protected handle(event: BlockchainBaccaratCardListType<Choices>) {
        this.gameData.cardList.change(event.blockchain as Blockchain);
        // this.gameData.cardList.changeCurrentIndex(event.blockchain?.currentIndex);
    }
}
