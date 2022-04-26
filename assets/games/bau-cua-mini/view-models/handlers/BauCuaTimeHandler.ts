import AudioManager from "../../../../common/audio/AudioManager";
import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import BauCua from "../BauCua";

export default class BauCuaTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: BauCua) {
        super(main);
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.main.shakeThePlateTime;
    }

    get isStartingNewGameRound() {
        return this.main.currentTimeRemaining === this.main.shakeThePlateTime;
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.finishShakeThePlate = false;
            this.main.shakeAnimation.node.active = true;
            this.main.shakeAnimation.play();
            AudioManager.getInstance().playSFX(this.main.shakeAudio.clip);
            this.main.finishShakeThePlate = true;
        }
    }

    handleInLockBetTime() {
        super.handleAtLockBetTime();
        this.handleInLockBetTimeOptions(this.main);
    }

    handleInRoundTime() {
        this.handleInRoundTimeOptions(this.main);
        this.main.hideAllDices();
        this.main.thePlate.active = false;
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.main.dices.forEach((dice) => {
            dice.node.active = true;
        });
        this.main.highlightWinningBetItems(true);
    }

    showWaitTime() {
        this.showWaitTimeOptions(this.main);
    }
}
