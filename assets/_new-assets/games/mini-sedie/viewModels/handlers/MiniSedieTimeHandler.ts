import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniSedie from "../MiniSedie";
import { numberPad } from "../../../../common/helpers/Helper";

export default class MiniSedieTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: MiniSedie) {
        super(main);
    }

    handleWaitTime() {
        this.main.animatedTime.node.active = false;
        this.main.showProcessingWarning(false);

        let shakingDuration = 2;
        let shakeTimePoint = this.main.config.betTime + shakingDuration + 1;
        if (this.main.currentTimeRemaining > shakeTimePoint) {
            this.main.setGameRound(this.main.roundId);
            if (!this.main.resultAnimating) {
                this.main.showResult();
            }
            var time = numberPad(this.main.currentTimeRemaining - this.main.config.betTime - shakingDuration - 1, 2);
            this.main.timeWaitNode && (this.main.timeWaitNode.active = true);
            this.main.timeWaitLabel.string = "00:" + numberPad(time, 2);
        }
        else {
            this.main.timeWaitNode && (this.main.timeWaitNode.active = false);
            this.main.setGameRound(this.main.roundId + 1);

            if (this.main.currentTimeRemaining == shakeTimePoint) {
                this.main.dishNode.active = true;
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
        this.main.dishNode.active = true;
    }
}