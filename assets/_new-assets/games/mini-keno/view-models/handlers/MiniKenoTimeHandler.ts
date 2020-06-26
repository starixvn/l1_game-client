import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKeno from "../MiniKeno";
import MiniKenoBetItem from "../components/MiniKenoBetItem";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.stopBetWarning.active = false;
        // this.main.highlightWonItem(this.main.currentDataLogs[0].settlementResult, false, true);
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.resetAnimatedTime();
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
