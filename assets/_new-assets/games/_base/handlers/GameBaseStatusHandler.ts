
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameRoomBase from "../GameRoomBase";

export default interface IGameBaseStatusHandler extends DataHandler {
    currentStatusData: any;
}

export default class GameBaseStatusHandler implements IGameBaseStatusHandler {
    public currentStatusData: any;

    constructor(protected readonly main: GameBase) {
    }

    private timeout: number;

    handle(data: any): boolean {
        if (data.status) {
            this.currentStatusData = data.status;
            this.status(this.currentStatusData.win, this.currentStatusData.bet);
        }

        return true;
    }

    clearTimeout() {
        this.timeout && clearTimeout(this.timeout);
    }

    status(win: boolean, bet: number): void {
        var mainRoomGame = this.main as GameRoomBase;
        if (mainRoomGame && mainRoomGame.enablePlaceChips) {
            return;
        }

        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }

        this.timeout = setTimeout(() => {
            if (win) {
                this.main.showWinningBet(bet);;

                cc.RedT.send({
                    user: {
                        updateCoint: true
                    }
                });
            }
        }, 2e3);
    }
}
