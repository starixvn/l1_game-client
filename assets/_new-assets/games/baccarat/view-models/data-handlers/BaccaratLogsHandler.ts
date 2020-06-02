import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import Baccarat from "../Baccarat";
import * as _ from "lodash";
import { BasicHistoryData } from "../../../_base/view-models/BasicHistoryBoard";
import { getLowercaseObjectKeys } from '../../../../common/helpers/Helper.js';
import { TotalHistoryData } from "../TotalHistoryBoard";
import BaccaratDragonScoreBoard, { BaccaratDragonScoreBoardItemData } from "../BaccaratDragonScoreBoard";

export default class BaccaratLogsHandler extends GameBaseLogsHandler {

    constructor(protected readonly main: Baccarat) {
        super(main);
    }

    buildLogs(dataLogs) {
        this.buildBasicScoreBoard(dataLogs);
        this.buildTotalScoreBoard(dataLogs);
        this.buildDragonScoreBoard(dataLogs);
    }

    private buildBasicScoreBoard(dataLogs: any) {
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
        });

        this.main.basicHistoryBoard.setData(historyData.reverse());
    }

    private buildTotalScoreBoard(dataLogs: any) {
        const totalHistoryData = _.map(this.main.betItems, item => {
            const resultKeys = getLowercaseObjectKeys(dataLogs[0].result);
            const total = _.filter(dataLogs, log => log.result[resultKeys[item.node.name.toLowerCase()]]).length;
            return new TotalHistoryData(item.node.name, total.toString());
        });
        this.main.totalHistoryBoard.setData(totalHistoryData);
    }

    private buildDragonScoreBoard(dataLogs: any) {
        dataLogs = _.map(dataLogs, (log, index) => {
            const previousLog = dataLogs[parseInt(index) + 1];
            log.result.tieCount = 0;

            if (previousLog) {
                log.previousLog = previousLog;
            }

            return log;
        })

        _.forEach(dataLogs, (log) => {
            log.result.tie && this.setTieLog(log, log.previousLog);
        });

        const noTieDataLogs = _.filter(dataLogs, (log) => !log.result.tie);
        const detailHistoreBoardData = _.map(noTieDataLogs, (log, index) => {
            const result = log.result;

            if (result.banker) {
                return new BaccaratDragonScoreBoardItemData(BaccaratDragonScoreBoard.BANKER, result.playerPair, result.bankerPair, result.isTie, result.tieCount);
            }

            if (result.player) {
                return new BaccaratDragonScoreBoardItemData(BaccaratDragonScoreBoard.PLAYER, result.playerPair, result.bankerPair, result.isTie, result.tieCount);
            }
        });
        this.main.detailHistoryBoard.setData(detailHistoreBoardData.reverse());
    }

    private setTieLog(log, previousLog) {
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
