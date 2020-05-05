
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameUtils from "../../GameUtils";

export default class GameBaseStatusHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    private timeout: number;

    handle(data: any): boolean {
        if (data.status && data.bet) {
            this.status(data.status, data.bet);
        }
        return true;
    }

    clearTimeout() {
        this.timeout && clearTimeout(this.timeout);
    }

    status(win, bet) {
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
