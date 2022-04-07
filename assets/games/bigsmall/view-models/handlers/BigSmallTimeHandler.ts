import AudioManager from "../../../../common/audio/AudioManager";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import BigSmall, { DishAnimation } from "../BigSmall";

export default class BigSmallTimeHandler extends GameBaseTimeHandler {
    protected shakeThePlateTime = 52;
    protected displayResultTime = 59;

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
            this.main.balanceBet(true);
            this.main.currentTimeRemaining--;
        } else {
            this.main.hideBalanceBetNotice();
            this.main.enableHistoryButton();

            if (this.isDisplayResultTime) {
                cc.RedT.GAME_IS_SHOWED && this.main.showResult();
                setTimeout(() => {
                    this.main.showWinningAnimation(this.main.currentDataLogs[0]);
                }, 1000);
                this.main.currentTimeRemaining--;
            } else {
                super.gameUpdate();
            }
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.statusHandler.currentStatusData = null;
        cc.RedT.GAME_IS_SHOWED && this.shakeThePlate();
    }

    handleInRoundTime() {
        this.main.setGameRound(this.main.roundId);
        this.main.resetThePlate();
        this.main.resultNode.active = false;
        this.main.betItems.forEach((item) => item.resetHighlight());

        if (this.main.currentTimeRemaining <= this.main.config.betTime) {
            this.showRoundTime();
            cc.tween(this.main.bgTimer).to(0.3, { opacity: 255 }).start();
        }
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.main.thePlate.opacity = 0;
        this.main.resultNode.active = true;
        cc.tween(this.main.bgTimer).to(0.3, { opacity: 0 }).start();
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.shakeThePlateTime - 1);
    }

    shakeThePlate() {
        cc.tween(this.main.thePlate)
            .call(() => {
                this.main.shakeThePlateAnimation.playAdditive(DishAnimation.ShakeDish);
                setTimeout(() => {
                    AudioManager.getInstance().playSFX(this.main.shakeDishAudio.clip);
                }, 1200);
            })
            .start();
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.betItems.forEach((item) => item.setHighlight(false));
    }
}
