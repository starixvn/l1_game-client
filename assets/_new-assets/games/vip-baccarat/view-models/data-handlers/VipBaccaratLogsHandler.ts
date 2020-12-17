import * as _ from 'lodash';

import { getLowercaseObjectKeys } from '../../../../common/helpers/Helper.js';
import GameBaseLogsHandler from '../../../_base/handlers/GameBaseLogsHandler';
import { BasicHistoryData } from '../../../_base/view-models/BasicHistoryBoard';
import BaccaratDragonScoreBoard, { BaccaratDragonScoreBoardItemData } from '../../../baccarat/view-models/BaccaratDragonScoreBoard';
import { TotalHistoryData } from '../../../baccarat/view-models/TotalHistoryBoard';
import VipBaccarat from '../VipBaccarat';
import VipBaccaratFinishHandler from './VipBaccaratFinishHandler';

export default class VipBaccaratLogsHandler extends GameBaseLogsHandler {
  constructor(protected readonly main: VipBaccarat) {
    super(main);
  }

  handle(data: any): boolean {
    super.handle(data);

    
    if (data.roundHistory && data.roundHistory[0]) {
      const lastLog = data.roundHistory[0];
      const result = lastLog.result;
      const settlementResult = lastLog.settlementResult;
      const finishHandler = this.main.finishHandler as VipBaccaratFinishHandler;

      if (this.main.timeHandler.isInWaitTime) {
        const player = Object.values(result.player).filter((value) => value != null);
        const banker = Object.values(result.banker).filter((value) => value != null);

        this.main.playerCards.showCardsWithoutAnimation(player);
        this.main.bankerCards.showCardsWithoutAnimation(banker);
        finishHandler.showWinNotice(settlementResult);
      }

      if (this.main.currentTimeRemaining > this.main.config.stopBetTime) {
        finishHandler.showResult(settlementResult, false);
      }
    }

    return true;
  }

  buildLogs(dataLogs) {
    if (dataLogs[dataLogs.length - 1] && dataLogs[dataLogs.length - 1].previousLog != undefined) {
      dataLogs[dataLogs.length - 1].previousLog = null;
    }

    this.buildBasicScoreBoard(dataLogs);
    this.buildTotalScoreBoard(dataLogs);
    this.buildDragonScoreBoard(dataLogs);
    this.main.miniRoundHistory.setData(dataLogs);
  }

  private buildBasicScoreBoard(dataLogs: any) {
    const historyData = _.map(dataLogs, (log) => {
      const result = log.settlementResult;
      if (result.banker) {
        return new BasicHistoryData('banker', '0');
      }
      if (result.player) {
        return new BasicHistoryData('player', '0');
      }
      if (result.tie) {
        return new BasicHistoryData('tie', '0');
      }
    });

    this.main.basicHistoryBoard.setData(historyData.reverse());
  }

  private buildTotalScoreBoard(dataLogs: any) {
    const firstLog = dataLogs[0];

    if (!firstLog) {
      return;
    }

    const resultKeys = getLowercaseObjectKeys(firstLog.settlementResult);

    const totalHistoryData = _.map(this.main.betItems, (item) => {
      const total = _.filter(dataLogs, (log) => log.settlementResult[resultKeys[item.node.name.toLowerCase()]]).length;
      return new TotalHistoryData(item.node.name, total.toString());
    });

    this.main.totalHistoryBoard.setData(totalHistoryData);
  }

  private buildDragonScoreBoard(dataLogs: any) {
    dataLogs = _.map(dataLogs, (log, index) => {
      const previousLog = dataLogs[parseInt(index) + 1];
      log.settlementResult.tieCount = 0;

      if (previousLog) {
        log.previousLog = previousLog;
      } else {
        if (log.settlementResult.tie) {
          log.settlementResult.firstTie = true;
        }
      }

      return log;
    });

    _.forEach(dataLogs, (log) => {
      log.settlementResult.tie && this.setTieLog(log, log.previousLog);
    });

    const noTieDataLogs = _.filter(dataLogs, (log) => !log.settlementResult.tie || log.settlementResult.firstTie);
    const detailHistoreBoardData = _.map(noTieDataLogs, (log, index) => {
      const result = log.settlementResult;

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

    this.main.detailHistoryBoard.setData(detailHistoreBoardData.reverse());
  }

  private setTieLog(log, previousLog) {
    if (log && log.settlementResult.tie && previousLog) {
      previousLog.settlementResult.bankerPair = previousLog.settlementResult.bankerPair || log.settlementResult.bankerPair;
      previousLog.settlementResult.playerPair = previousLog.settlementResult.playerPair || log.settlementResult.playerPair;
      this.setTieLog(previousLog, previousLog.previousLog);
      return;
    }

    if (log) {
      log.settlementResult.isTie = true;
      log.settlementResult.tieCount = log.settlementResult.tieCount + 1;
    }
  }
}
