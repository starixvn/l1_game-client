import * as _ from 'lodash';

import BaccaratLogsHandler from '../../../baccarat/view-models/data-handlers/BaccaratLogsHandler';
import VipBaccarat from '../VipBaccarat';
import VipBaccaratFinishHandler from './VipBaccaratFinishHandler';
import GameRoomBase from '../../../_base/GameRoomBase';

export default class VipBaccaratLogsHandler extends BaccaratLogsHandler {
  constructor(protected readonly main: GameRoomBase) {
    super(main);
  }

  protected getLogDataFollowTypePlayer(isBanker: boolean, data: any) {
    const resultTmp = data.result;
    if (isBanker) {
      return Object.values(resultTmp.banker).filter((value) => value != null);
    }
    return Object.values(resultTmp.player).filter((value) => value != null);
  }

  protected getOwnMain(): any {
    return this.main as VipBaccarat;
  }

  protected getOwnFinishHandle(): any {
    const ownMain = this.getOwnMain();
    return ownMain.finishHandler as VipBaccaratFinishHandler;
  }

  protected getSettlementResult(lastLog: any) {
    return lastLog.settlementResult;
  }

  public convertLogsDataLogs(dataLogs: any) {
    const logs = [];
    dataLogs.forEach((element: any) => {
      const data = {
        banker: {},
        player: {},
        result: {},
        roundId: 0,
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

  protected updateMiniHistoryLogs(dataLogs: any) {
    const ownMain = this.getOwnMain();
    ownMain.miniRoundHistory.setData(dataLogs);
  }
}
