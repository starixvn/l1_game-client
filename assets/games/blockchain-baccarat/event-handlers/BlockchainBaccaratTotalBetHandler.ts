import { BlockchainBaccaratTotalBetType } from "./../event-models/BlockchainBaccaratTotalBetModel";
import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";

export type BlockchainBaccaratTotalBet<Choices> = {
    totalBets: BlockchainBaccaratTotalBetType;
};

export default class BlockchainBaccaratTotalBetHandler<Choices> extends BaseEventHandler<BlockchainBaccaratTotalBet<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratTotalBet<Choices>) {
        return event.totalBets != null;
    }

    protected handle(event: BlockchainBaccaratTotalBet<Choices>) {
        this.gameData.totalBet.change(event.totalBets);
    }
}
