import GameUtils from "../../../../common/GameUtils";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import BitcoinMaster from "../BitcoinMaster";
import BitCoinMasterAnimatedTime from "../BitCoinMasterAnimatedTime";

export default class BitcoinMasterTimeHandler extends GameBaseTimeHandler {
    protected displayResultTime = 119;
    protected waitResultTimePoint = 60;
    protected balanceDuration = 2;
    protected betTime = 45;
    protected animatedTime: BitCoinMasterAnimatedTime;
    protected isShowResult = false;

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

    gameUpdate(): void {
        this.animatedTime = this.main.animatedTime as BitCoinMasterAnimatedTime;
        if (this.main.gameConfigs) {
            if (this.isInWaitTime) {
                this.handleWaitTime();
            } else {
                if (this.isStartingNewGameRound) {
                    this.handleStartingNewGameRound();
                    this.isShowResult = false;
                }

                if (this.isInRoundTime) {
                    this.handleInRoundTime();
                    this.isShowResult = false;

                    if (this.isInLockBetTime) {
                        if (this.main.currentTimeRemaining === this.main.config.stopBetTime) {
                            this.handleAtLockBetTime();
                        }
                        this.handleInLockBetTime();
                    }
                } else {
                    this.handleInEndTime();
                }
            }
        }

        this.main.currentTimeRemaining--;
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
            this.main.balanceBet();
            this.handleWaitingCandleResult();
        } else {
            this.handleBettingPhase();
        }
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (this.isDisplayResultTime) {
            if (!this.isShowResult) {
                cc.RedT.GAME_IS_SHOWED && this.main.showResult();
                this.main.showWinningAnimation(this.main.currentDataLogs[0]);
                this.isShowResult = true;
            }

            this.main.updateDescTimeGeneralInfo(GameUtils.getText("ui.result"));
            const timeConvert = this.main.currentTimeRemaining - this.main.config.betTime;
            this.animatedTime.updateProgress(timeConvert, 2);
            this.animatedTime.setTime(this.formatTime(timeConvert));
        }
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.main.updateDescTimeGeneralInfo(GameUtils.getText("ui.payout"));
        this.animatedTime.updateProgress(15, 2);
        this.animatedTime.setTime(this.formatTime(15));
    }

    private handleWaitingCandleResult() {
        this.main.updateDescTimeGeneralInfo(GameUtils.getText("ui.waitResult"));
        this.animatedTime.updateProgress(this.main.currentTimeRemaining, 1);
        this.animatedTime.setTime(this.formatTime(this.main.currentTimeRemaining));
        this.main.showProcessingWarning(false);
    }

    private handleBettingPhase() {
        this.main.updateDescTimeGeneralInfo(GameUtils.getText("ui.placing_bet"));
        const timeConvert = this.main.currentTimeRemaining - this.waitResultTimePoint;
        this.animatedTime.setTime(this.formatTime(timeConvert));
        this.animatedTime.updateProgress(timeConvert, 0);
    }

    showMainTime(show: boolean) {
        this.main.animatedTime.node.active = true;
    }

    showWaitTime() {
        this.main.timeWaitNode.active = false;
    }

    handleInLockBetTime() {
        this.main.updateDescTimeGeneralInfo(GameUtils.getText("ui.no_more_bet"));
    }
}
