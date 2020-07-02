import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKeno from "../MiniKeno";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleInRoundTime() {
        super.handleInRoundTime();

        this.main.currentDataLogs && this.main.highlightWonItem(this.main.currentDataLogs[0].settlementResult, false, true);
    }

    handleWaitTime() {
        super.handleWaitTime();
        const resultAnimationTime = (this.main.finishHandler as GameBaseFinishHandler).getResultAnimationTime();
        const resultAnimationPlayed = this.main.currentTimeRemaining < this.main.config.fullTime - resultAnimationTime;

        if (resultAnimationPlayed) {
            const lastLog = this.main.currentDataLogs[0];
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult, lastLog.roundId, lastLog.time);
            this.main.highlightWonItem(lastLog.settlementResult, true, true);
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult, lastLog.roundId, lastLog.time);
            this.main.roundResult.showResult(false);
        }

        const lastWaitTime = this.main.currentTimeRemaining == this.main.config.betTime + 1;

        if (lastWaitTime && this.main.node.activeInHierarchy && !this.main.isStopGame) {
            this.main.node.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.scaleTo(0.45, 0, 1).easing(cc.easeCubicActionIn()),
                cc.scaleTo(0.45, 1, 1).easing(cc.easeCubicActionOut())
            ));
        }
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();

        this.main.roundResult.clear();
        this.main.betBoard.close();
        this.main.resetWinningBetItems();
    }

    resetTime(): void {
        super.resetTime();
        this.resetAnimatedTime();
    }

    protected resetAnimatedTime() {
        this.main.animatedTime.resetTime();
    }
}
