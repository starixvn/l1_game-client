import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import Sedie from "../Sedie";

export default class SedieTimeHandler extends GameBaseTimeHandler {

    private readonly shakeThePlateTime = 32;

    constructor(protected readonly main: Sedie) {
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
        this.shakeThePlate();
    }

    handleInRoundTime() {
        this.main.setGameRound(this.main.roundId);

        if (this.main.currentTimeRemaining <= this.main.config.betTime) {
            this.showRoundTime();
        }
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (this.main.currentTimeRemaining > this.shakeThePlateTime && !this.main.finishShowResult) {
            this.main.showResult();
            this.main.thePlate.position = cc.v2(0, 150);
            this.main.finishShowResult = true;
        }
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.shakeThePlateTime - 1);
    }

    shakeThePlate() {
        cc.tween(this.main.thePlate)
            .to(0.5, { position: cc.v2(0, 0) })
            .call(() => {
                cc.RedT.isSoundGame() && this.main.shakeThePlateAudio.play();
                this.main.shakeThePlateAnimation.play();
            })
            .start();
    }
}