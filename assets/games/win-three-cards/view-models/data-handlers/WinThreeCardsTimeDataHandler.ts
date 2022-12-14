import BaccaratTimeHandler from "../../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import WinThreeCards from "../WinThreeCards";

export default class WinThreeCardsTimeDataHandler extends BaccaratTimeHandler {
    protected getOwnMain(): WinThreeCards {
        return this.main as WinThreeCards;
    }
    handleInLockBetTime() {
        this.main.betItems.forEach((item) => item.setHighlight(false));
        this.getOwnMain().scoreboard.renderNextNode();
        if (this.main.currentTimeRemaining <= this.main.config.stopBetTime && this.main.currentDataLogs.length >= 102) {
            this.main.currentDataLogs.pop();
            this.getOwnMain().logsHandler.buildLogs(this.main.currentDataLogs);
        }
    }
    handleFlyCards() {
        const baccarat = this.getOwnMain();
        baccarat.dragonCards.resetCards();
        baccarat.phoenixCards.resetCards();
        this.main.setGameRound(this.main.roundId);
        this.main.node.runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(() => baccarat.phoenixCards.flyFirstCard()),
                cc.delayTime(0.4),
                cc.callFunc(() => baccarat.dragonCards.flyFirstCard()),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.phoenixCards.flySecondCard()),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.dragonCards.flySecondCard()),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.phoenixCards.flyThirdCard()),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.dragonCards.flyThirdCard())
            )
        );
    }
}
