import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import BitcoinMaster from "../BitcoinMaster";

export default class BitcoinMasterTimeHandler extends GameBaseTimeHandler {
    protected displayResultTime = 119;
    protected waitResultTimePoint = 60;
    protected balanceDuration = 3;
    protected betTime = 45;

    constructor(protected readonly main: BitcoinMaster) {
        super(main);
    }

    get isInRoundTime() {
        return this.main.currentTimeRemaining > 0;
    }

    get isInLockBetTime() {
        return (
            this.main.currentTimeRemaining < this.main.config.stopBetTime && //
            this.main.currentTimeRemaining >= this.main.config.minBetTime
        );
    }

    get isInBalanceBetTime() {
        return (
            this.main.currentTimeRemaining <= this.waitResultTimePoint &&
            this.main.currentTimeRemaining > this.waitResultTimePoint - this.balanceDuration
        );
    }

    get isDisplayResultTime() {
        return this.main.currentTimeRemaining > this.main.config.betTime;
    }

    protected setCurrentTimeRemaining(data: any) {
        this.main.currentTimeRemaining = data.remainingTime;
    }

    playTime(): void {
        this.gameUpdate();
        super.playTime();
    }

    resetTime(): void {
        this.showMainTime(false);
    }

    handleInRoundTime() {
        super.handleInRoundTime();

        if (this.isInBalanceBetTime) {
            if (this.main.balanceBetNoticeContainer.childrenCount === 0) {
                this.main.showBalanceBetNotice();
            }
            this.main.balanceBet();
        } else {
            this.main.hideBalanceBetNotice();
            this.main.enableHistoryButton();
        }

        if (this.main.currentTimeRemaining <= this.waitResultTimePoint) {
            this.handleWaitingCandleResult();
        } else {
            this.handleBettingPhase();
        }
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (this.isDisplayResultTime) {
            cc.RedT.GAME_IS_SHOWED && this.main.showResult();
            this.main.showWinningAnimation(this.main.currentDataLogs[0]);

            this.main.updateDescTimeGeneralInfo("Kết Quả");
            const timeConvert = this.main.currentTimeRemaining - this.main.config.betTime;
            this.main.animatedTime.setTime(this.formatTime(timeConvert));
        }
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.main.updateDescTimeGeneralInfo("Kết Quả");
        this.main.animatedTime.setTime(this.formatTime(15));
    }

    private handleWaitingCandleResult() {
        this.main.updateDescTimeGeneralInfo("Chờ Kết Quả");
        this.main.animatedTime.setTime(this.formatTime(this.main.currentTimeRemaining));
        this.main.showProcessingWarning(false);
    }

    private handleBettingPhase() {
        this.main.updateDescTimeGeneralInfo("Đặt Lệnh");
        const timeConvert = this.main.currentTimeRemaining - this.waitResultTimePoint;
        this.main.animatedTime && this.main.animatedTime.setTime(this.formatTime(timeConvert));
    }

    showMainTime(show: boolean) {
        this.main.animatedTime.node.active = true;
    }

    showWaitTime() {
        this.main.timeWaitNode.active = false;
    }
}
