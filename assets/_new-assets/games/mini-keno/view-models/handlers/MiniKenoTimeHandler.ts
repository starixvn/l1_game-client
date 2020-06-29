import { GameState } from "../../../_base/GameBase";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKenoBetItem from "../components/MiniKenoBetItem";
import MiniKeno from "../MiniKeno";

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
        const lastWaitTime = this.main.currentTimeRemaining == this.main.config.betTime + 1;

        if (lastWaitTime && this.main.node.activeInHierarchy && this.main.gameState == GameState.Started) {
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
        this.main.betItems.forEach((item: MiniKenoBetItem) => item.hideWinningText());
        this.main.betBoard.close(false);
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.resetAnimatedTime();
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
