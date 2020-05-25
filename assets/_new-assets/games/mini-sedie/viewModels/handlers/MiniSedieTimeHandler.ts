import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniSedie from "../MiniSedie";

export default class MiniSedieTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: MiniSedie) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();

        this.main.setGameRound(this.main.roundId);
        this.main.showResult();
    }

    handleInRoundTime() {
        super.handleInRoundTime();

        this.main.animation.node.active = false;
        this.main.setGameRound(this.main.roundId + 1);
        this.main.betItems.forEach(item => item.setHighlight(true));
        this.main.roundResult.node.active = false;
    }
}