import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniSedie from "../MiniSedie";

export default class MiniSedieTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: MiniSedie) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();

        let shakeTimePoint = this.main.config.betTime + 3;
        if (this.main.currentTimeRemaining > shakeTimePoint) {
            if (!this.main.resultAnimating) {
                this.main.showResult();
            }
        }
        else {
            if (this.main.currentTimeRemaining == shakeTimePoint) {
                this.main.dishNode.runAction(cc.sequence(
                    cc.moveTo(0.3, cc.v2(0, 0)),
                    cc.callFunc(() => {
                        this.main.animation.play();
                    })
                ));
            }
        }
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        this.main.animation.stop();
        this.main.betItems.forEach(item => item.resetHighlight());
        this.main.dishNode.position = cc.v2(0, 0);
    }
}