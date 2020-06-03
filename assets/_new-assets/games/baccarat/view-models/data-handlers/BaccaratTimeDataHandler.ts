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
            cc.callFunc(() => baccarat.playerCards.flyFirstCard()),
            cc.delayTime(0.3),
            cc.callFunc(() => baccarat.bankerCards.flyFirstCard()),
            cc.delayTime(0.3),
            cc.callFunc(() => baccarat.playerCards.flySecondCard()),
            cc.delayTime(0.3),
            cc.callFunc(() => baccarat.bankerCards.flySecondCard()),
        ))
    }
}
