import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import ThreeCards from "../ThreeCards";

export default class ThreeCardsTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: ThreeCards) {
        super(main);
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.resetCards();
        this.main.betItems.forEach((item) => item.setHighlight(false));
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.highlightLastResult();
        this.main.resetCards();
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.highlightLastResult();
        this.main.resetCards();
    }

    handleWaitTime() {
        super.handleWaitTime();
        const dealingCardsDuration = 2;
        if (this.main.currentTimeRemaining === this.main.config.betTime + dealingCardsDuration) {
            this.main.playDealingAnimation();
            this.handleStartingNewGameRound();
        }
    }
}
