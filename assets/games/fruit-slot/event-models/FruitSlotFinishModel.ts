import { Blockchain } from "./BlockchainBaccaratCardListModel";
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { ResultCards } from "../BlockchainBaccaratType";
import { BaccaratSettlementResult } from "../../baccarat/view-models/event-models/BaccaratSettlementResult";

export type CardChainResult = {
    player: ResultCards;
    banker: ResultCards;
};

export type FruitSlotFinish = {
    result: CardChainResult;
    settlementResult: BaccaratSettlementResult;
    winningPlayers: any[];
    roundId: number;
    blockchain: Blockchain;
};

export class FruitSlotFinishModel extends EventEmitterBase {
    static Events = {
        CHANGE_SETTLEMENT: "settlement:change",
        SHOWED_ANIMATION: "animation:showed"
    };

    finishData: FruitSlotFinish;

    changeFinishResult(finish: FruitSlotFinish) {
        this.finishData = finish;
        this.emit(FruitSlotFinishModel.Events.CHANGE_SETTLEMENT, finish);
    }

    finishAnimationWinning() {
        this.emit(FruitSlotFinishModel.Events.SHOWED_ANIMATION, this);
    }

    clear() {
        this.finishData = null;
    }
}
