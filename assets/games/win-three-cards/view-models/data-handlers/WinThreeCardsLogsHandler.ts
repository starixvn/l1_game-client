import * as _ from "lodash";
import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import { BasicHistoryData } from "../../../_base/view-models/BasicHistoryBoard";
import WebSocketTableGameBase from "../../../_base/WebSocketTableGameBase";
import WinThreeCards from "../WinThreeCards";
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
            const lastLog = data.roundHistory[0];
            const settlementResult = lastLog.settlementResult;

            if (this.main.timeHandler.isInWaitTime) {
                const playerCards = this.getLogDataFollowTypePlayer(false, lastLog);
                const bankerCards = this.getLogDataFollowTypePlayer(true, lastLog);

                ownMain.playerCards.showCardsWithoutAnimation(playerCards);
                ownMain.bankerCards.showCardsWithoutAnimation(bankerCards);
                this.getOwnFinishHandle().showWinNotice(settlementResult);
            }

            if (this.main.currentTimeRemaining > this.main.config.stopBetTime) {
                this.getOwnFinishHandle().showResult(settlementResult, false);
            }
        }

        return true;
    }

    buildLogs(dataLogs: any) {
        if (dataLogs[dataLogs.length - 1] && dataLogs[dataLogs.length - 1].previousLog !== undefined) {
            dataLogs[dataLogs.length - 1].previousLog = null;
        }

        this.buildBasicScoreBoard(dataLogs);
        this.getOwnMain().scoreboard.renderScoreBoardInGame(dataLogs);
    }

    protected getLogDataFollowTypePlayer(isBanker: boolean, data: any) {
        const resultTmp = data.result;
        if (isBanker) {
            return Object.values(resultTmp.phoenix.cards).filter((value) => value != null);
        }
        return Object.values(resultTmp.dragon.cards).filter((value) => value != null);
    }

    protected buildBasicScoreBoard(dataLogs: any) {
        // handle

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

    protected buildBigRoadScoreBoard(dataLogs: any) {
        // handle
    }
}
