import { GameBaseStatusHandler } from "../../../_base/handlers/GameBaseStatusHandler";
import Lottery from "../Lottery";
import LotteryFinishHandler from "./LotteryFinishHandler";

export default class LotteryStatusHandler extends GameBaseStatusHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    status(win: boolean, bet: number): void {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }

        this.timeout = setTimeout(() => {
            this.showStatus(win, bet);
        }, 2e3);
    }

    showStatus(win: boolean, bet: number) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        if (win) {
            this.main.showWinningBet(bet);
            this.main.updateUserBalance();
        }
    }
}
