import BaccaratTimeDataHandler from "../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export default class BlockchainBaccaratTimeHandler extends BaccaratTimeDataHandler {
    protected getOwnMain(): any {
        return this.main as BlockchainBaccarat;
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
    }
}
