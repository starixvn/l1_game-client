import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoTimeHandler from "../../../mini-keno/view-models/handlers/MiniKenoTimeHandler";

export default class MiniKenoProVietTimeHandler extends MiniKenoTimeHandler {
    private receiveTimeRemaining: number;

    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    protected setCurrentTimeRemaining(data: any) {
        this.receiveTimeRemaining = data.timeRemaining;

        if (this.main.roundEndTime && !this.main.isIncomingGameRound) {
            if (data.remainingTime <= this.main.config.stopBetTime) {
                this.main.roundResult.clear();
                this.main.betItems.forEach(item => item.setHighlight(false));
            }

            const remainingTime = (this.main.roundEndTime.getTime() - new Date().getTime()) / 1000;
            this.main.currentTimeRemaining = remainingTime;
        }
        else {
            super.setCurrentTimeRemaining(data);
        }
    }

    playTime() {
        if (this.main.isIncomingGameRound) {
            super.playTime();
        }
        else {
            if (this.receiveTimeRemaining == 0 && this.playTimeInterval) {
                return;
            }

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
}
