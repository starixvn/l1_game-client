import { updateOtherPlayerBalance } from "../action/OtherPlayerAction";
import { payChips } from "../action/PayChipsAction";
import GameBase from "../GameBase";
import WebSocketTableGameBase from "../WebSocketTableGameBase";
import DataHandler from "./DataHandler";

export default class GameBaseFinishHandler implements DataHandler {
    readonly payChipFlyTime = 1.2;
    get WinningAnimationDuration() {
        return 3;
    }

    constructor(protected readonly main: GameBase, protected readonly playResultAnimationTime: number = 0) {}

    handle(data: any) {
        if (data.finish) {
            this.main.finishShowResult = false;
            this.main.winnersData = null;
            this.main.node.activeInHierarchy && this.main.gameAudios.playEndGameAudio();
            this.setNewGameRound(data);
            const mainRoomGame = this.main as WebSocketTableGameBase;
            if (mainRoomGame && mainRoomGame.playerHandler) {
                updateOtherPlayerBalance(data.finish.winningPlayers, mainRoomGame);
            }
            this.handleFinishData(data.finish, () => {
                payChips(
                    this.main,
                    data.finish.settlementResult,
                    data.finish.winningPlayers,
                    this.payChipFlyTime,
                    this.WinningAnimationDuration
                );
                this.main.finishShowResult = true;
            });
        }
    }

    protected setNewGameRound(data: any) {
        this.main.timeHandler.resetTime();
        this.main.roundId = data.finish.roundId + 1;
    }

    public getResultAnimationTime() {
        return this.playResultAnimationTime;
    }

    handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        // handleFinishData
    }
}
