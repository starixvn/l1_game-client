import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";

export type BlockchainBaccaratNewBlockchainType<Choices> = {
    newBlockchain: Blockchain;
};

export class BlockchainBaccaratNewBlockchainHandler<Choices> extends BaseEventHandler<
    BlockchainBaccaratNewBlockchainType<Choices>,
    Choices
> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratNewBlockchainType<Choices>) {
        return event.newBlockchain != null;
    }

    protected handle(event: BlockchainBaccaratNewBlockchainType<Choices>) {
        this.gameData.cardList.updateNewBlockchain(event.newBlockchain as Blockchain);
        this.gameData.roundHistory.cleanWithoutTriggerEvent();
    }
}
