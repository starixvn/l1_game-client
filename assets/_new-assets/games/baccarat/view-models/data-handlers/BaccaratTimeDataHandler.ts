import Baccarat from "../Baccarat";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";

export default class BaccaratTimeHandler extends GameBaseTimeHandler {
    handleWaitTime() {
        super.handleWaitTime();
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();

        var baccarat = this.main as Baccarat;
        baccarat.bankerCards.resetCards();
        baccarat.playerCards.resetCards();

        this.main.node.runAction(cc.sequence(
            cc.callFunc(() => baccarat.playerCards.flyCards()),
            cc.delayTime(0.8),
            cc.callFunc(() => baccarat.bankerCards.flyCards())))
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        var baccarat = this.main as Baccarat;

        if (baccarat.currentDataLogs) {
            baccarat.setGameRound(baccarat.currentDataLogs[0].roundId + 1);
        }
    }

}
