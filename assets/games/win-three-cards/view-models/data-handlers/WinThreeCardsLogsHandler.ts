import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import { BasicHistoryData } from "../../../_base/view-models/BasicHistoryBoard";
import WebSocketTableGameBase from "../../../_base/WebSocketTableGameBase";
import WinThreeCards from "../WinThreeCards";
import { WinThreeCardResult } from "../models/WinThreeCardsModel";
import WinThreeCardsFinishHandler from "./WinThreeCardsFinishHandler";

export default class WinThreeCardsLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: WebSocketTableGameBase) {
        super(main);
    }

    protected getOwnMain(): WinThreeCards {
        return this.main as WinThreeCards;
    }

    protected getOwnFinishHandle(): any {
        return this.getOwnMain().finishHandler as WinThreeCardsFinishHandler;
    }

    handle(data: any): boolean {
        super.handle(data);

        if (data.roundHistory && data.roundHistory[0]) {
            const ownMain = this.getOwnMain();
            const { result, settlementResult } = data.roundHistory[0];

            if (this.main.timeHandler.isInWaitTime) {
                const { dragon, phoenix } = result;
                ownMain.dragonCards.cardResult = new WinThreeCardResult(dragon);
                ownMain.phoenixCards.cardResult = new WinThreeCardResult(phoenix);

                ownMain.phoenixCards.showCardsWithoutAnimation();
                ownMain.dragonCards.showCardsWithoutAnimation();
                this.getOwnFinishHandle().showWinNotice(settlementResult);
            }

            if (this.main.currentTimeRemaining > this.main.config.stopBetTime) {
                this.getOwnFinishHandle().showResult(settlementResult, false);
            }
        }

        return true;
    }

    buildLogs(dataLogs: any) {
        this.buildBasicScoreBoard(dataLogs);
        this.getOwnMain().scoreboard.renderScoreBoardInGame(dataLogs);
    }

    public buildBasicScoreBoard(dataLogs: any) {
        // handle
        if (dataLogs[dataLogs.length - 1] && dataLogs[dataLogs.length - 1].previousLog !== undefined) {
            dataLogs[dataLogs.length - 1].previousLog = null;
        }

        const historyData = dataLogs.map((log) => {
            const settlementResult = log?.settlementResult;
            if (settlementResult?.dragon) {
                return new BasicHistoryData("dragon", "0");
            }
            if (settlementResult?.phoenix) {
                return new BasicHistoryData("phoenix", "0");
            }
            if (settlementResult?.tie) {
                return new BasicHistoryData("tie", "0");
            }

            return new BasicHistoryData("", "0");
        });

        const historyDataTmp = [...historyData].reverse();
        this.getOwnMain().basicHistoryBoard.setData(historyDataTmp);
    }
}
