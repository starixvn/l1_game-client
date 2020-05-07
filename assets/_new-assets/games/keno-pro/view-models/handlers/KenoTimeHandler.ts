import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import Keno from "../Keno";

export default class KenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: Keno) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.main.handleWaitTime();
    }

    handleInTurnTime() {
        super.handleInTurnTime();
        this.main.handleInTurnTime();
    }
}
