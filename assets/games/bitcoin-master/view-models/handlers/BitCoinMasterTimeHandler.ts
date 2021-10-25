import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import BitcoinMaster from "../BitcoinMaster";

export default class BitcoinMasterTimeHandler extends GameBaseTimeHandler {
    protected displayResultTime = 119;
    protected startNewGameRoundAtTime = 105;
    protected waitResultTime = 60;
    protected betTime = 45;

    constructor(protected readonly main: BitcoinMaster) {
        super(main);
    }

    get isInLockBetTime() {
        return (
            this.main.currentTimeRemaining < this.main.config.stopBetTime && this.main.currentTimeRemaining >= this.main.config.minBetTime
        );
    }

    get isInWaitTime() {
        console.log("isInWaitTime", this.main.currentTimeRemaining <= this.waitResultTime);
        return this.main.currentTimeRemaining <= this.waitResultTime;
    }

    get isStartingNewGameRound() {
        return this.main.currentTimeRemaining === this.startNewGameRoundAtTime;
    }

    get isInRoundTime() {
        return this.main.currentTimeRemaining >= this.main.config.minBetTime;
    }

    get isInBalanceBetTime() {
        return this.main.currentTimeRemaining <= this.waitResultTime && this.main.currentTimeRemaining > this.waitResultTime - 2;
    }

    get isDisplayResultTime() {
        return this.main.currentTimeRemaining > this.startNewGameRoundAtTime;
    }

    gameUpdate(): void {
        if (this.isInBalanceBetTime) {
            this.main.balanceBet();
            this.main.animatedTime && this.main.animatedTime.setTime(this.formatTime(this.main.currentTimeRemaining));
            this.main.currentTimeRemaining--;
        } else {
            this.main.hideBalanceBetNotice();
            this.main.enableHistoryButton();

            if (this.isDisplayResultTime) {
                cc.RedT.GAME_IS_SHOWED && this.main.showResult();
                this.main.showWinningAnimation(this.main.currentDataLogs[0]);

                this.main.updateDescTimeGeneralInfo("Kết Quả");
                const timeConvert = this.main.currentTimeRemaining - this.startNewGameRoundAtTime;
                this.main.animatedTime && this.main.animatedTime.setTime(this.formatTime(timeConvert));

                this.main.currentTimeRemaining--;
            } else {
                super.gameUpdate();
            }
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.statusHandler.currentStatusData = null;
    }

    handleInRoundTime() {
        this.main.setGameRound(this.main.roundId);
        this.main.betItems.forEach((item) => item.resetHighlight());

        if (this.main.currentTimeRemaining <= this.startNewGameRoundAtTime) {
            this.showRoundTime();
        }
    }

    handleWaitTime() {
        if (this.main.timeWaitNode) {
            this.main.finishShowResult && this.showWaitTime();
        }

        this.main.updateDescTimeGeneralInfo("Chờ Kết Quả");
        this.main.animatedTime && this.main.animatedTime.setTime(this.formatTime(this.main.currentTimeRemaining));

        this.main.showProcessingWarning(false);
        this.main.setGameRound(this.main.roundId - 1);
    }

    showRoundTime() {
        if (this.main.timeWaitNode) {
            this.main.timeWaitNode.active = false;
        }
        this.main.updateDescTimeGeneralInfo("Đặt Lệnh");
        const timeConvert = this.main.currentTimeRemaining - this.waitResultTime;
        this.main.animatedTime && this.main.animatedTime.setTime(this.formatTime(timeConvert));
    }

    showWaitTime() {}
}
