
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameUtils from "../../../common/GameUtils";
import GameRoomBase from "../GameRoomBase";
export default interface IGameBaseStatusHandler extends DataHandler {
    statusData: any;
}

export default class GameBaseStatusHandler implements IGameBaseStatusHandler {
    public statusData: any;

    constructor(protected readonly main: GameBase) {
    }

    private timeout: number;

    handle(data: any): boolean {
        if (data.status) {
            this.statusData = data.status;
            this.status(this.statusData, this.statusData.bet);
        }

        return true;
    }

    clearTimeout() {
        this.timeout && clearTimeout(this.timeout);
    }

    status(win: boolean, bet: number): void {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        this.timeout = setTimeout(() => {
            if (win) {
                GameUtils.addFlyingText(this.main.noticeNode, win, bet, 4);
                cc.RedT.send({
                    user: {
                        updateCoint: true
                    }
                });
            }
        }, 2e3);
    }
}
