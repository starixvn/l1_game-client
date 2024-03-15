import { appManager } from "../../../managers/AppManager";
import GameBase from "../GameBase";
import WebSocketTableGameBase from "../WebSocketTableGameBase";
import DataHandler from "./DataHandler";

export interface IGameBaseStatusHandler extends DataHandler {
    currentStatusData: any;
}

export class GameBaseStatusHandler implements IGameBaseStatusHandler {
    public currentStatusData: any;

    constructor(protected readonly main: GameBase) {}

    protected timeout: any;

    handle(data: any) {
        if (data.status) {
            this.updateStatusData(data.status);

            const mainRoomGame = this.main as WebSocketTableGameBase;
            if (mainRoomGame?.userProfile) {
                if (this.main.shouldShowWinningEffect()) {
                    this.main.showPayoutForLoginPlayer(mainRoomGame);
                }

                return;
            }

            if (this.main.usingNewSettlement) {
                if (this.main.timeHandler.isInWaitTime) {
                    this.main.finishShowResult && this.showStatus(this.currentStatusData.win, this.currentStatusData.bet);
                }
            } else {
                // old settlement status data go before "finish" data
                // show status with delay time
                this.status(this.currentStatusData.win, this.currentStatusData.bet);
                this.clearStatusData();
            }
        }
    }

    showStatusIfExist() {
        if (this.currentStatusData) {
            this.showStatus(this.currentStatusData.win, this.currentStatusData.bet);
            this.clearStatusData();
        }
    }

    updateStatusData(data: any) {
        this.currentStatusData = data;
    }

    clearStatusData() {
        this.updateStatusData(null);
    }

    clearTimeout() {
        this.timeout && clearTimeout(this.timeout);
    }

    status(win: boolean, bet: number, delayTime = 2e3): void {
        if (!appManager.GAME_IS_SHOWED) {
            return;
        }

        this.timeout = setTimeout(() => {
            this.showStatus(win, bet);
        }, delayTime);
    }

    showStatus(win: boolean, bet: number) {
        if (!appManager.GAME_IS_SHOWED) {
            return;
        }
        if (win) {
            this.main.showWinningBet(bet);
            this.main.updateUserBalance();
        }
    }
}
