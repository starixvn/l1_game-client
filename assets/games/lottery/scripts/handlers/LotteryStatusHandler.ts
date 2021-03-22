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
            const playerNode = this.main.userAvatar.node.parent;
            this.main.showWinningBet(bet);

            const finishHandler = this.main.finishHandler as LotteryFinishHandler;
            finishHandler.playWinningEffect(this.main, playerNode);
            this.main.updateUserBalance();
        }
    }
}
