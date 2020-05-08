import Baccarat from "../Baccarat";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";

export default class BaccaratTimeHandler extends GameBaseTimeHandler {
    handleInTurnTime() {
        super.handleInTurnTime();
        var baccarat = this.main as Baccarat;
        baccarat.bankerCards.resetCards();
        baccarat.playerCards.resetCards();

        if (baccarat.currentDataLogs) {
            baccarat.setGameRound(baccarat.currentDataLogs[0].roundId + 1);
        }
    }
}
