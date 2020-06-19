import DataHandler from "./DataHandler";
import GameBase, { GameState } from "../GameBase";
import { numberPad } from "../../../common/helpers/Helper";
import * as _ from "lodash";
import GameRoomBase from "../GameRoomBase";

export interface IGameBaseTimeHandler extends DataHandler {
    playTimeInterval: number;
    playTime(): void;
    stopPlayTime(): void;
    resetTime(): void;
    isInWaitTime: boolean;
}

export default class GameBaseTimeHandler implements IGameBaseTimeHandler {
    playTimeInterval: number;

    constructor(protected readonly main: GameBase) {
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.main.config.betTime;
    }

    handle(data: any): boolean {
        if (data.remainingTime) {
            this.setCurrentTimeRemaining(data);
            this.playTime();
            this.main.hideUmMessage();
            return true;
        }
    }


    resetTime(): void {
        this.main.animatedTime && (this.main.animatedTime.node.active = false);
        this.main.currentTimeRemaining = this.main.config.fullTime;
        this.playTime();
    }

    playTime(): void {
        this.main.gameState = GameState.Started;
        this.playTimeInterval && clearInterval(this.playTimeInterval);

        this.playTimeInterval = setInterval(() => {
            if (this.isInWaitTime) {
                this.handleWaitTime();
            } else {
                const isStartingNewGameRound = this.main.currentTimeRemaining == this.main.config.betTime;

                if (isStartingNewGameRound) {
                    this.handleStartingNewGameRound();
                }

                const isInRoundTime = this.main.currentTimeRemaining >= this.main.config.minBetTime;

                if (isInRoundTime) {
                    this.handleInRoundTime();

                    const isInLockBetTime = this.main.currentTimeRemaining <= this.main.config.stopBetTime;

                    if (isInLockBetTime) {
                        this.handleInLockBetTime();
                    }
                } else {
                    this.handleInEndTime();
                }
            }
            this.main.currentTimeRemaining--;
        }, 1000);
    }



    stopPlayTime(): void {
        this.playTimeInterval && clearInterval(this.playTimeInterval);
    }

    handleWaitTime() {
        if (this.main.timeWaitNode) {
            this.main.finishShowResult && (this.main.timeWaitNode.active = true);
            this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.main.config.betTime - 1);
        }

        this.main.animatedTime && (this.main.animatedTime.node.active = false);
        this.main.showProcessingWarning(false);
        this.main.setGameRound(this.main.roundId - 1);
    }

    handleStartingNewGameRound() {
        this.main.noticeNode.destroyAllChildren();
        this.main.gameAudios && this.main.gameAudios.playStartGameAudio();
        this.main.resetDataAndUI();

        var mainRoomGame = this.main as GameRoomBase;

        if (mainRoomGame && mainRoomGame.playerHandler) {
            mainRoomGame.playerHandler.updateTablePlayers();
        }
    }

    handleInRoundTime() {
        this.main.timeWaitNode && (this.main.timeWaitNode.active = false);
        const time = this.formatTime(this.main.currentTimeRemaining);
        this.main.animatedTime && (this.main.animatedTime.setTime(time));
        this.main.setGameRound(this.main.roundId);
    }

    handleInLockBetTime() {
    }

    handleInEndTime() {
        this.main.timeWaitNode && (this.main.timeWaitNode.active = false);
        this.main.animatedTime && (this.main.animatedTime.node.active = false);
        clearInterval(this.playTimeInterval);
    }

    protected formatTime(time: number): string {
        return numberPad(time, 2);
    }

    protected setCurrentTimeRemaining(data: any) {
        this.main.currentTimeRemaining = data.remainingTime - 1;
    }
}