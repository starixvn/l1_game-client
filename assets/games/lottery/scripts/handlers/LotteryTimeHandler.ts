import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import Lottery from "../Lottery";

export default class LotteryTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.resetAnimatedTime();
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
        this.main.updateDisplayOwnBets();
        this.main.clearHighlight();
        this.main.checkAvailableConfirmation();
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.resetAnimatedTime();
    }

    resetAnimatedTime() {
        if (this.main.animatedTime) {
            this.main.animatedTime.node.active = true;
            this.main.animatedTime.setTime("0");
        }
    }

    resetTime(): void {
        super.resetTime();
        this.resetAnimatedTime();
    }
}
