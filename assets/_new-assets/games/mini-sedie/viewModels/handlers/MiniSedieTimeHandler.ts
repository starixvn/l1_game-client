import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniSedie from "../MiniSedie";

export default class MiniSedieTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: MiniSedie) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (this.main.currentTimeRemaining == this.main.config.betTime + 3) {
            this.main.dishNode.runAction(cc.sequence(
                cc.moveTo(0.3, cc.v2(0, 0)),
                cc.callFunc(() => {
                    this.main.animation.play();
                })
            ));
        } else {
            if (!this.main.resultAnimating) {
                this.main.setGameRound(this.main.roundId);
                this.main.showResult();
            }
        }
    }

    handleInRoundTime() {
        super.handleInRoundTime();

        this.main.setGameRound(this.main.roundId + 1);
        this.main.betItems.forEach(item => item.resetHighlight());
        this.main.dishNode.position = cc.v2(0, 0);
    }
}