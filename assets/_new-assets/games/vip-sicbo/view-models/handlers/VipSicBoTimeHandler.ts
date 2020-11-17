import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import VipSicBo from "../VipSicBo";

export default class VipSicBoTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: VipSicBo) {
        super(main);
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.main.shakeThePlateTime;
    }

    get isStartingNewGameRound() {
        return this.main.currentTimeRemaining == this.main.shakeThePlateTime;
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.highlightLastResult();

        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.finishShakeThePlate = false;
            this.main.shakeAnimation.node.active = true;
            this.main.shakeAnimation.play();
            cc.RedT.isSoundGame() && this.main.shakeAudio.play();
            this.main.finishShakeThePlate = true;
        }
    }

    handleInLockBetTime() {
        super.handleAtLockBetTime();
        this.main.betItems.forEach((item) => item.resetHighlight());
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

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.main.shakeThePlateTime - 1);
    }
}
