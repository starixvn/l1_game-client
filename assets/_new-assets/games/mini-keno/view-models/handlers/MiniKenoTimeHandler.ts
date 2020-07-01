import { GameState } from "../../../_base/GameBase";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKenoBetItem from "../components/MiniKenoBetItem";
import MiniKeno from "../MiniKeno";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.stopBetWarning.active = false;
        this.main.currentDataLogs && this.main.highlightWonItem(this.main.currentDataLogs[0].settlementResult, false, true);
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.resetAnimatedTime();

        const resultAnimationTime = (this.main.finishHandler as GameBaseFinishHandler).getResultAnimationTime();
        const resultAnimationPlayed = this.main.currentTimeRemaining < this.main.config.fullTime - resultAnimationTime;
        if (resultAnimationPlayed) {
            this.main.highlightWonItem(this.main.currentDataLogs[0].settlementResult, true, true);
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
        this.main.stopBetWarning.active = true;
        this.main.roundResult.clear();
        this.main.betBoard.close();
        this.main.resetWinningBetItems();
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.resetAnimatedTime();
        this.main.resetWinningBetItems();
    }

    resetTime(): void {
        super.resetTime();
        this.resetAnimatedTime();
    }

    private resetAnimatedTime() {
        this.main.animatedTime && (this.main.animatedTime.node.active = true);
        this.main.animatedTime.resetTime();
    }
}
