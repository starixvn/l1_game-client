import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKeno from "../MiniKeno";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.stopBetWarning.active = false;
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.resetAnimatedTime();
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.stopBetWarning.active = true;
        this.main.roundResult.clear();
        this.main.betItems.forEach(item => item.setHighlight(false));
        this.main.betBoard.close();
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
