import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";

type BlockchainBaccaratShoe = {
    newBlockchain: any;
    updatedBlockchain: any;
};

export default class BlockchainBaccaratShoeHandler<Choices> extends BaseEventHandler<BlockchainBaccaratShoe, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratShoe) {
        return event.newBlockchain != null || event.updatedBlockchain != null;
    }

    protected handle(event: BlockchainBaccaratShoe) {
        this.gameData.roundHistory.clear();
    }
}
