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

    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.time) {
            this.main.currentTimeRemaining = data.time - 1;
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
                self.handleWaitTime();
            } else {
                const isInTurnTime = self.main.currentTimeRemaining > this.main.config.minBetTime;

                if (isInTurnTime) {
                    self.handleInTurnTime();
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

    handleWaitTime() {
        var time = numberPad(this.main.currentTimeRemaining - this.main.config.betTime - 1, 2);
        this.main.timeWaitNode && (this.main.timeWaitNode.active = true);
        this.main.timeWaitLabel.string = "00:" + numberPad(time, 2);
    }

    handleInTurnTime() {
        var time = numberPad(this.main.currentTimeRemaining - 1, 2);
        this.main.animatedTime.setTime(time);
        this.main.animatedTime.node.active = true;
    }

}