import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import RongHo from "../RongHo";

export default class RHGameTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: RongHo) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (!this.main.resultAnimating) {
            this.main.showResult(true);
            this.main.resultAnimating = true;
        }
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.showResult(false);
    }
}
