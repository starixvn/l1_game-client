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
        this.main.stopBetWarning.active = false;

        if (this.main.currentTimeRemaining < this.main.config.betTime + 2) {
            // this.main.roundResult.node.active = false;
        }
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();

        this.main.stopBetWarning.active = true;
        this.main.betItems.forEach(item => item.setHighlight(false));
        this.main.betBoard.close();
    }
}
