import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKeno from "../MiniKeno";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();

        this.main.currentDataLogs && this.main.highlightWonItem(
            this.main.currentDataLogs[0].settlementResult,
            { isAnimated: false, showWinningEffect: true });
    }

    handleWaitTime() {
        super.handleWaitTime();

        const lastWaitTime = this.main.currentTimeRemaining == this.main.config.betTime + 1;

        if (lastWaitTime
            && cc.RedT.GAME_IS_SHOWED
            && this.main.node.activeInHierarchy
            && !this.main.isStopGame
            && !this.main.isGoingToDisabled) {
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
