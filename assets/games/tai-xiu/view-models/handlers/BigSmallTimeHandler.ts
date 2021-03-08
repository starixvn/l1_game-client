import GameBaseTimeHandler from '../../../_base/handlers/GameBaseTimeHandler';
import BigSmall from '../BigSmall';

export default class BigSmallTimeHandler extends GameBaseTimeHandler {
    private readonly shakeThePlateTime = 32;
    private readonly displayResultTime = 37;

    constructor(protected readonly main: BigSmall) {
        super(main);
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.shakeThePlateTime;
    }

    get isInBalanceBetTime() {
        return this.main.currentTimeRemaining > this.displayResultTime;
    }

    get isStartingNewGameRound() {
        return this.main.currentTimeRemaining === this.shakeThePlateTime;
    }

    get isDisplayResultTime() {
        return this.main.currentTimeRemaining === this.displayResultTime;
    }

    gameUpdate(): void {
        if (this.isInBalanceBetTime) {
            this.main.balanceBet();
            this.main.currentTimeRemaining--;
        } else {
            this.main.hideBalanceBetNotice();
            this.main.enableHistoryButton();

            if (this.isDisplayResultTime) {
                cc.RedT.GAME_IS_SHOWED && this.main.showResult();
                this.main.showWinningAnimation();
                this.main.currentTimeRemaining--;
            } else {
                super.gameUpdate();
            }
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.statusHandler.currentStatusData = null;
        this.main.highlightLastResult();
    }

    handleInRoundTime() {
        this.main.setGameRound(this.main.roundId);
        this.main.betItems.forEach((item) => item.resetHighlight());

        if (this.main.currentTimeRemaining <= this.main.config.betTime) {
            this.showRoundTime();
        }
    }

    handleWaitTime() {
        super.handleWaitTime();
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.shakeThePlateTime - 1);
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.betItems.forEach((item) => item.setHighlight(false));
    }
}
