import Baccarat from "../Baccarat";
import GameBaseTimeHandler from "../../../../common/game/handlers/GameBaseTimeHandler";

export default class BaccaratTimeHandler extends GameBaseTimeHandler {
    handleInTurnTime() {
        super.handleInTurnTime();
        var baccarat = this.main as Baccarat;

        if (baccarat.currentDataLogs) {
            baccarat.setGameRound(baccarat.currentDataLogs[0].phien + 1);
        }
    }
}
