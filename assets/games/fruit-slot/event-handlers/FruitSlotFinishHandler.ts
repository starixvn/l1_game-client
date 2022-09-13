import { BaccaratSettlementResult } from "../../baccarat/view-models/event-models/BaccaratSettlementResult";
import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BaseEventHandler } from "./../../_new/_base/game-data-management/event-handlers/base-handler";
import { CardChainResult } from "./../event-models/BlockchainBaccaratFinishModel";

export type FruitSlotFinish = {
    finish: {
        result: CardChainResult;
        settlementResult: BaccaratSettlementResult;
        winningPlayers: any[];
        id: number;
        blockchain: Blockchain;
    };
};

export class FruitSlotFinishHandler extends BaseEventHandler<FruitSlotFinish> {
    protected readonly gameData: BlockchainBaccaratGameData;

    protected verifyEvent(event: FruitSlotFinish) {
        return event.finish != null;
    }

    protected handle(event: FruitSlotFinish) {
        this.gameData.emit(BlockchainBaccaratGameData.Events.SETTLED, event.finish.settlementResult);
        this.gameData.finishModel.changeFinishResult(event.finish);
    }
}
