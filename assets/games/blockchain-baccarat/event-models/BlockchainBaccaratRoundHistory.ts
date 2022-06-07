import { BaccaratSettlementResult } from "./../../baccarat/view-models/event-models/BaccaratSettlementResult";
import { CardValue } from "../BlockchainBaccaratType";

export class BlockchainBaccaratRoundHistory {
    roundId: number;
    settlementResult: BaccaratSettlementResult;
    result: { player: CardValue; banker: CardValue };
}
