import MiniKenoTimeHandler from "../../../mini-keno/view-models/handlers/MiniKenoTimeHandler";
import MiniKenoProViet from "../MiniKenoProViet";

export default class MiniKenoProVietTimeHandler extends MiniKenoTimeHandler {
    private receiveTimeRemaining: number;

    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.remainingTime || data.remainingTime >= 0) {
            this.receiveTimeRemaining = data.remainingTime;
            this.setCurrentTimeRemaining(data);
            this.playTime();
            return true;
        }
    }

    protected setCurrentTimeRemaining(data: any) {
        const isInFutureRound = this.main.roundEndTime && !this.main.isIncomingGameRound;

        if (isInFutureRound || this.isInLastRoundOfDay(data.remainingTime)) {
            if (data.remainingTime <= this.main.config.stopBetTime) {
                this.main.roundResult.clear();
                this.main.betItems.forEach(item => item.setHighlight(false));
            }

            if (this.main.roundEndTime) {
                const remainingTime = (this.main.roundEndTime.getTime() - new Date("2020-07-01T15:38:01.474+00:00").getTime()) / 1000;
                this.main.currentTimeRemaining = remainingTime;
            }
            else {
                this.main.currentTimeRemaining = data.remainingTime;
            }
        }
        else {
            super.setCurrentTimeRemaining(data);
        }
    }



    playTime() {
        if (this.main.isIncomingGameRound && !this.isInLastRoundOfDay(this.main.currentTimeRemaining)) {
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
        this.main.getPlayerBetsAndTimeOfRound(this.main.roundId.toString());
        this.main.getGameRounds();
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.stopBetWarning.active = !this.main.umNotice.node.active;
    }

    protected resetAnimatedTime() {
        this.main.animatedTime && (this.main.animatedTime.node.active = true);
        this.main.animatedTime.resetTime();
    }

    private isInLastRoundOfDay(remainingTime: number) {
        return remainingTime > this.main.config.fullTime;
    }
}
