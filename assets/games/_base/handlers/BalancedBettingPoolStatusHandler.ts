import GameBase from "../GameBase";
import { GameBaseStatusHandler } from "./GameBaseStatusHandler";

export default class BalancedBettingPoolStatusHandler extends GameBaseStatusHandler {
    constructor(protected readonly main: GameBase) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.status) {
            this.currentStatusData = data.status;
            if (this.main.timeHandler.isInWaitTime && this.main.finishShowResult) {
                this.showStatus(this.currentStatusData.win, this.currentStatusData.bet);
            }
        }

        return true;
    }
}
