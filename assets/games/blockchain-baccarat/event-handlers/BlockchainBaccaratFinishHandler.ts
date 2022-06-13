import { CardChainResult } from "./../event-models/BlockchainBaccaratFinishModel";
import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BaseEventHandler } from "./../../_new/_base/game-data-management/event-handlers/base-handler";
import { BaccaratSettlementResult } from "../../baccarat/view-models/event-models/BaccaratSettlementResult";

export type BlockchainBaccaratFinish<Choices> = {
    finish: {
        result: CardChainResult;
        settlementResult: BaccaratSettlementResult;
        winningPlayers: any[];
        roundId: number;
        blockchain: Blockchain;
    };
};

export default class BlockchainBaccaratFinishHandler<Choices> extends BaseEventHandler<BlockchainBaccaratFinish<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratFinish<Choices>) {
        return event.finish != null;
    }

    protected handle(event: BlockchainBaccaratFinish<Choices>) {
        this.gameData.emit(BlockchainBaccaratGameData.Events.SETTLED, event.finish.settlementResult);
        this.gameData.finishModel.changeFinishResult(event.finish);
        this.gameData.cardList.change(event.finish.blockchain);
    }
}
