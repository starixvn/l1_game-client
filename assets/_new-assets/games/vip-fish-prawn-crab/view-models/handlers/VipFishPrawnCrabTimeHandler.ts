import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import VipFishPrawnCrab from "../VipFishPrawnCrab";

export default class VipFishPrawnCrabTimeHandler extends GameBaseTimeHandler {
    private readonly shakeThePlateTime = 32;

    constructor(protected readonly main: VipFishPrawnCrab) {
        super(main);
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.shakeThePlateTime;
    }

    get isStartingNewGameRound() {
        return this.main.currentTimeRemaining == this.shakeThePlateTime;
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.finishShakeThePlate = false;
        this.main.shakeAnimation.node.active = true;
        this.main.shakeAnimation.play();
        this.main.finishShakeThePlate = true;
        this.main.highlightLastResult();
    }

    handleInRoundTime() {
        this.main.setGameRound(this.main.roundId);

        if (this.main.currentTimeRemaining <= this.main.config.betTime) {
            this.showRoundTime();
            if (!this.main.finishShakeThePlate) {
                this.main.shakeAnimation.node.active = true;
                const duration = this.main.shakeAnimation.defaultClip.duration;
                this.main.shakeAnimation.play("Shake", duration);
                this.main.finishShakeThePlate = true;
            }
        }
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (this.main.currentTimeRemaining > this.shakeThePlateTime && !this.main.finishShowResult) {
            this.main.setResult();
            this.main.shakeAnimation.node.active = false;
            this.main.openDiskAnimation.node.active = true;
            var duration = this.main.openDiskAnimation.defaultClip.duration;
            this.main.openDiskAnimation.play("Result", duration);
            this.main.finishShowResult = true;
        }
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.shakeThePlateTime - 1);
    }
}
