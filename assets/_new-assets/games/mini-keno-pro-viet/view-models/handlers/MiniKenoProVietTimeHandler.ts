import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoTimeHandler from "../../../mini-keno/view-models/handlers/MiniKenoTimeHandler";

export default class MiniKenoProVietTimeHandler extends MiniKenoTimeHandler {

    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    playTime() {
        if (this.main.isIncomingGameRound) {
            super.playTime();
        }
        else {
            this.playTimeInterval && clearInterval(this.playTimeInterval);

            this.playTimeInterval = setInterval(() => {
                if (this.main.currentTimeRemaining > 0) {
                    this.handleInRoundTime();
                    this.main.currentTimeRemaining--;
                }
                else {
                    clearInterval(this.playTimeInterval);
                }
            }, 1000);
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();

        this.main.getPlayerBets(this.main.roundId.toString());
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.main.roundResult.node.active = true;
    }

    protected setCurrentTimeRemaining(data: any) {
        if (this.main.roundEndTime && !this.main.isIncomingGameRound) {
            const remainingTime = (this.main.roundEndTime.getTime() - new Date().getTime()) / 1000;
            this.main.currentTimeRemaining = remainingTime;
        }
        else {
            super.setCurrentTimeRemaining(data);
        }
    }
}
