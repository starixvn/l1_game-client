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

        if (isInFutureRound || this.main.isInLastRoundOfDay(data.remainingTime)) {
            if (data.remainingTime <= this.main.config.stopBetTime) {
                this.main.roundResult.clear();
                this.main.resetWinningBetItems();
            }

            if (this.main.roundEndTime) {
                const remainingTime = (this.main.roundEndTime.getTime() - new Date().getTime()) / 1000;
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
        if (this.main.isIncomingGameRound && !this.main.isInLastRoundOfDay(this.main.currentTimeRemaining)) {
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
        this.main.timer.active = true;
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.roundResult.show();
        this.main.roundResult.setTimer(this.main.currentTimeRemaining.toString());
        this.main.timer.active = false;

        if (this.main.currentTimeRemaining % 10 == 0
            && this.main.currentTimeRemaining >= 30
            && !this.main.isStopGame) {

            if (this.main.roundResult.node.scaleX == 0) {
                this.main.stopBetWarning.active && this.rotateNode(this.main.stopBetWarning, this.main.roundResult.node);
            }
            else {
                this.rotateNode(this.main.roundResult.node, this.main.stopBetWarning);
            }
        }
    }

    handleInEndTime() {
        super.handleInEndTime();

        this.main.roundResult.node.scaleX = 1;
        this.main.stopBetWarning.active = false;
    }

    private rotateNode(oldNode: cc.Node, newNode: cc.Node, animationTime = 0.45) {
        newNode.active = true;

        if (newNode.scaleX == 1) {
            newNode.scaleX = 0;
        }

        cc.tween(oldNode)
            .to(animationTime, { scaleX: 0 }, { easing: "cubicIn" })
            .call(() => {
                cc.tween(newNode)
                    .to(animationTime, { scaleX: 1 }, { easing: "cubicOut" })
                    .start();
            })
            .start();
    }
}
