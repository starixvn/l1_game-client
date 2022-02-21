import { GameState } from "../GameBase";
import GameBaseTimeHandler from "./GameBaseTimeHandler";

export default class NoIntervalTimeHandler extends GameBaseTimeHandler {
    handle(data: any): boolean {
        if (data.remainingTime) {
            if ((data.remainingTime || data.remainingTime >= 0) && !this.main.isStopGame) {
                this.main.hideUmMessage();
                this.main.gameState = GameState.Started;

                return true;
            }
        }

        return false;
    }
}
