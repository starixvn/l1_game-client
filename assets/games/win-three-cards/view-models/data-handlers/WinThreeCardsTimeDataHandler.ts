import BaccaratTimeDataBaseHandler from "../../../_baccarat/data-handler/BaccaratTimeDataBaseHandler";
import BaccaratTimeHandler from "../../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler";
import WinThreeCards from "../WinThreeCards";

enum OrderCardFly {
    card1 = 0,
    card2,
    card3
}

export default class WinThreeCardsTimeDataHandler extends BaccaratTimeDataBaseHandler {
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

    async handleFlyCards() {
        const baccarat = this.getOwnMain();
        await Promise.all([...baccarat.dragonCards.dropCards(), ...baccarat.phoenixCards.dropCards()]).catch(() => {
            // handle
        });
        this.main.setGameRound(this.main.roundId);

        this.flyAllCards();
    }

    flyAllCards() {
        const baccarat = this.getOwnMain();
        this.main.node.runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(() => baccarat.phoenixCards.flyCard(OrderCardFly.card1)),
                cc.delayTime(0.4),
                cc.callFunc(() => baccarat.dragonCards.flyCard(OrderCardFly.card1)),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.phoenixCards.flyCard(OrderCardFly.card2)),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.dragonCards.flyCard(OrderCardFly.card2)),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.phoenixCards.flyCard(OrderCardFly.card3)),
                cc.delayTime(0.2),
                cc.callFunc(() => baccarat.dragonCards.flyCard(OrderCardFly.card3))
            )
        );
    }
}
