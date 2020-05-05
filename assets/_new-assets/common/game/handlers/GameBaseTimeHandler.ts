import DataHandler from "./DataHandler";
import GameBase from "../GameBase";
import { numberPad } from "../../../common/helpers/Helper";

export interface IGameBaseTimeHandler extends DataHandler {
    playTimeInterval: number;
    playTime(): void;
    stopPlayTime(): void;
}

export default class GameBaseTimeHandler implements IGameBaseTimeHandler {
    playTimeInterval: number;

    constructor(private readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.time) {
            this.main.currentTimeRemaining = data.time;
            this.playTime();
            return true;
        }
    }

    playTime(): void {
        this.playTimeInterval && clearInterval(this.playTimeInterval);
        var self = this;

        this.playTimeInterval = setInterval(() => {
            const isInWaitTime = self.main.currentTimeRemaining > this.main.config.betTime;

            if (isInWaitTime) {
                self.showWaitTime();
            } else {
                const isInTurnTime = self.main.currentTimeRemaining > this.main.config.minBetTime;

                self.setGameRound();

                if (isInTurnTime) {
                    self.showTime();
                } else {
                    clearInterval(self.playTimeInterval);
                }
            }
            self.main.currentTimeRemaining--;
        }, 1000);
    }

    stopPlayTime(): void {
        this.playTimeInterval && clearInterval(this.playTimeInterval);
    }

    showTime() {
        var time = numberPad(this.main.currentTimeRemaining - 1, 2);
        this.main.animatedTime.setTime(time);
        this.main.animatedTime.node.active = true;
    }

    setGameRound() {
    }

    private showWaitTime() {
        var time = numberPad(this.main.currentTimeRemaining - this.main.config.betTime - 1, 2);
        this.main.timeWaitNode && (this.main.timeWaitNode.active = true);
        this.main.timeWaitLabel.string = "00:" + numberPad(time, 2);
    }
}