import { numberPad } from "../../../common/helpers/Helper";
import GameBase, { GameState } from "../GameBase";
import GameRoomBase from "../GameRoomBase";
import DataHandler from "./DataHandler";

export interface IGameBaseTimeHandler extends DataHandler {
    playTimeInterval: number;
    playTime(): void;
    stopPlayTime(): void;
    resetTime(): void;
    isInWaitTime: boolean;
    isInLockBetTime: boolean;
    isStartingNewGameRound: boolean;
}

export default class GameBaseTimeHandler implements IGameBaseTimeHandler {
    playTimeInterval: number;

    constructor(protected readonly main: GameBase) {
    }

    get isInLockBetTime() {
        return this.main.currentTimeRemaining <= this.main.config.stopBetTime;
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.main.config.betTime;
    }

    get isStartingNewGameRound() {
        return this.main.currentTimeRemaining == this.main.config.betTime;
    }

    handle(data: any): boolean {
        if (data.remainingTime || data.remainingTime >= 0) {
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
                if (this.isStartingNewGameRound) {
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
        this.main.node.activeInHierarchy && this.main.gameAudios && this.main.gameAudios.playStartGameAudio();
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
        this.main.setGameRound(this.main.roundId);
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