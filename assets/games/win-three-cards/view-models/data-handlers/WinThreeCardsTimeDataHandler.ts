import BaccaratTimeDataBaseHandler from "../../../_baccarat/data-handler/BaccaratTimeDataBaseHandler";
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
    }

    async handleFlyCards() {
        const baccarat = this.getOwnMain();
        await Promise.all([...baccarat.dragonCards.dropCards(), ...baccarat.phoenixCards.dropCards()]).catch(() => {
            // handle
        });
        this.main.setGameRound(this.main.roundId);

        this.flyAllCards();
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(
            this.main.currentTimeRemaining - this.main.config.betTime - this.dealCardsTime - 1
        );
    }

    flyAllCards() {
        const baccarat = this.getOwnMain();
        const gapTimeFly = 0.1;
        this.main.node.runAction(
            cc.sequence(
                cc.delayTime(gapTimeFly),
                cc.callFunc(() => baccarat.phoenixCards.flyCard(OrderCardFly.card1)),
                cc.delayTime(gapTimeFly),
                cc.callFunc(() => baccarat.dragonCards.flyCard(OrderCardFly.card1)),
                cc.delayTime(gapTimeFly),
                cc.callFunc(() => baccarat.phoenixCards.flyCard(OrderCardFly.card2)),
                cc.delayTime(gapTimeFly),
                cc.callFunc(() => baccarat.dragonCards.flyCard(OrderCardFly.card2)),
                cc.delayTime(gapTimeFly),
                cc.callFunc(() => baccarat.phoenixCards.flyCard(OrderCardFly.card3)),
                cc.delayTime(gapTimeFly),
                cc.callFunc(() => baccarat.dragonCards.flyCard(OrderCardFly.card3))
            )
        );
    }
}
