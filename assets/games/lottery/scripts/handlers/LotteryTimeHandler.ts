import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import Lottery from "../Lottery";

export default class LotteryTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    handleInEndTime() {
        super.handleInEndTime();
        if (this.main.animatedTime) {
            this.main.animatedTime.node.active = true;
            this.main.animatedTime.setTime("0");
        }
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.checkAvailableConfirmation();
        this.main.hideTicketConfirmation();
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.checkAvailableConfirmation();
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.ownBets = {};
        this.main.clearHighlight();
        this.main.checkAvailableConfirmation();
    }

    handleWaitTime() {
        super.handleWaitTime();
        if (this.main.animatedTime) {
            this.main.animatedTime.node.active = true;
        }
        if (this.main.currentTimeRemaining <= this.main.config.betTime + 1) {
            this.main.hideResultDialog();
            this.main.updateLastResult();
            this.main.updateMiniRoundHistories();
            // this.main.highlightLastResult();
        }
    }

    resetTime(): void {
        super.resetTime();
        if (this.main.animatedTime) {
            this.main.animatedTime.node.active = true;
        }
    }
}
