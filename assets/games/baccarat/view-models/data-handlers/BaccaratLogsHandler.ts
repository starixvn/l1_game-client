import * as _ from "lodash";
import { getLowercaseObjectKeys } from "../../../../common/helpers/ObjectHelper";
import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import { BasicHistoryData } from "../../../_base/view-models/BasicHistoryBoard";
import WebSocketTableGameBase from "../../../_base/WebSocketTableGameBase";
import Baccarat from "../Baccarat";
import BaccaratDragonScoreBoard, { BaccaratDragonScoreBoardItemData } from "../BaccaratDragonScoreBoard";
import { TotalHistoryData } from "../TotalHistoryBoard";
import BaccaratFinishHandler from "./BaccaratFinishHandler";

export default class BaccaratLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: WebSocketTableGameBase) {
        super(main);
    }

    handle(data: any): boolean {
        super.handle(data);

        if (data.roundHistory && data.roundHistory[0]) {
            const lastLog = data.roundHistory[0];
            const settlementResult = this.getSettlementResult(lastLog);
            const finishHandler = this.getOwnFinishHandle();

            if (this.main.timeHandler.isInWaitTime) {
                const playerCards = this.getLogDataFollowTypePlayer(false, lastLog);
                const bankerCards = this.getLogDataFollowTypePlayer(true, lastLog);

                const ownMain = this.getOwnMain();
                ownMain.playerCards.showCardsWithoutAnimation(playerCards);
                ownMain.bankerCards.showCardsWithoutAnimation(bankerCards);
                finishHandler.showWinNotice(settlementResult);
            }

            if (this.main.currentTimeRemaining > this.main.config.stopBetTime) {
                finishHandler.showResult(settlementResult, false);
            }
        }

        return true;
    }

    protected getLogDataFollowTypePlayer(isBanker: boolean, data: any) {
        const resultTmp = data.result;
        if (isBanker) {
            return Object.values(resultTmp.banker).filter((value) => value != null);
        }
        return Object.values(resultTmp.player).filter((value) => value != null);
    }

    protected getOwnMain(): any {
        return this.main as Baccarat;
    }

    protected getOwnFinishHandle(): any {
        const ownMain = this.getOwnMain();
        return ownMain.finishHandler as BaccaratFinishHandler;
    }

    protected getSettlementResult(lastLog: any) {
        return lastLog.settlementResult;
    }

    buildLogs(dataLogs: any) {
        dataLogs = this.convertLogsDataLogs(dataLogs);
        if (dataLogs[dataLogs.length - 1] && dataLogs[dataLogs.length - 1].previousLog !== undefined) {
            dataLogs[dataLogs.length - 1].previousLog = null;
        }

        this.buildBasicScoreBoard(dataLogs);
        this.buildTotalScoreBoard(dataLogs);
        this.buildDragonScoreBoard(dataLogs);
        this.updateMiniHistoryLogs(dataLogs);
    }

    public convertLogsDataLogs(dataLogs: any) {
        const logs = [];
        dataLogs.forEach((element: any) => {
            const data = {
                banker: {},
                player: {},
                result: {},
                roundId: 0
            };
            const settlementResult = element.settlementResult;
            const result = element.result;
            data.banker = Object.values(result.banker).filter((value) => value != null);
            data.player = Object.values(result.player).filter((value) => value != null);
            data.result = settlementResult;
            data.roundId = element.roundId;

            logs.push(data);
        });

        return logs;
    }

    protected updateMiniHistoryLogs(dataLogs: any) {}

    protected buildBasicScoreBoard(dataLogs: any) {
        const historyData = _.map(dataLogs, (log) => {
            const result = log.result;
            if (result.banker) {
                return new BasicHistoryData("banker", "0");
            }
            if (result.player) {
                return new BasicHistoryData("player", "0");
            }
            if (result.tie) {
                return new BasicHistoryData("tie", "0");
            }

            return new BasicHistoryData("", "0");
        });

        const ownMain = this.getOwnMain();
        const tmpData = [...historyData].reverse();
        ownMain.basicHistoryBoard.setData(tmpData);
    }

    protected buildTotalScoreBoard(dataLogs: any) {
        const firstLog = dataLogs[0];

        if (!firstLog) {
            return;
        }

        const resultKeys = getLowercaseObjectKeys(firstLog.result);
        const totalHistoryData = _.map(this.main.betItems, (item) => {
            const total = _.filter(dataLogs, (log) => log.result[resultKeys[item.node.name.toLowerCase()]]).length;
            return new TotalHistoryData(item.node.name, total.toString());
        });

        const ownMain = this.getOwnMain();
        ownMain.totalHistoryBoard.setData(totalHistoryData);
    }

    protected buildDragonScoreBoard(dataLogs: any) {
        const ownMain = this.getOwnMain();
        dataLogs = _.map(dataLogs, (log, index) => {
            const previousLog = dataLogs[parseInt(index) + 1];
            log.result.tieCount = 0;

            if (previousLog) {
                log.previousLog = previousLog;
            } else {
                if (log.result.tie) {
                    log.result.firstTie = true;
                }
            }

            return log;
        });

        _.forEach(dataLogs, (log) => {
            log.result.tie && this.setTieLog(log, log.previousLog);
        });

        const noTieDataLogs = _.filter(dataLogs, (log) => !log.result.tie || log.result.firstTie);
        const detailHistoryBoardData = _.map(noTieDataLogs, (log, index) => {
            const result = log.result;

            if (result.banker) {
                return new BaccaratDragonScoreBoardItemData(
                    BaccaratDragonScoreBoard.BANKER,
                    result.playerPair,
                    result.bankerPair,
                    result.natural,
                    result.isTie,
                    result.tieCount
                );
            } else if (result.player) {
                return new BaccaratDragonScoreBoardItemData(
                    BaccaratDragonScoreBoard.PLAYER,
                    result.playerPair,
                    result.bankerPair,
                    result.natural,
                    result.isTie,
                    result.tieCount
                );
            } else {
                return new BaccaratDragonScoreBoardItemData(
                    BaccaratDragonScoreBoard.BANKER,
                    result.playerPair,
                    result.bankerPair,
                    result.natural,
                    result.isTie || result.tie,
                    result.tieCount,
                    result.firstTie
                );
            }
        });

        const tmpData = [...detailHistoryBoardData].reverse(); // de-structure and create a new array, so reverse doesn't impact 'a'
        ownMain.detailHistoryBoard.setData(tmpData);
    }

    protected setTieLog(log, previousLog) {
        if (log && log.result.tie && previousLog) {
            previousLog.result.bankerPair = previousLog.result.bankerPair || log.result.bankerPair;
            previousLog.result.playerPair = previousLog.result.playerPair || log.result.playerPair;
            this.setTieLog(previousLog, previousLog.previousLog);
            return;
        }

        if (log) {
            log.result.isTie = true;
            log.result.tieCount = log.result.tieCount + 1;
        }
    }
}
