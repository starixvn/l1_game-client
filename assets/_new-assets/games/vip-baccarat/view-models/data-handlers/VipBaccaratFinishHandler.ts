import VipBaccarat from '../VipBaccarat';
import BaccaratFinishHandler, { TypeGame } from '../../../baccarat/view-models/data-handlers/BaccaratFinishHandler';
import * as _ from 'lodash';
import VipBaccaratLogsHandler from './VipBaccaratLogsHandler';

export default class VipBaccaratFinishHandler extends BaccaratFinishHandler {
  protected getOwnMain(): any {
    return this.main as VipBaccarat;
  }

  protected getDataFollowTypePlayer(data: any, isBanker: boolean) {
    if (isBanker) {
      return Object.values(data.banker).filter((value) => value != null);
    }
    return Object.values(data.player).filter((value) => value != null);
  }

  protected insertCurrentDataLogs(baccaratMain: any, dataFinish: any) {
    if (dataFinish.winningPlayers) {
      delete dataFinish.winningPlayers;
    }

    baccaratMain.currentDataLogs.unshift(dataFinish);
  }

  protected handleBuildLogs(baccaratMain: any) {
    (baccaratMain.logsHandler as VipBaccaratLogsHandler).buildLogs(baccaratMain.currentDataLogs);
    baccaratMain.miniRoundHistory.setData(baccaratMain.currentDataLogs);
  }

  protected handleBuildMiniLogs(baccaratMain: any) {
    const logsHandler = baccaratMain.logsHandler as VipBaccaratLogsHandler;
    const currentDataLogs = logsHandler.convertLogsDataLogs(baccaratMain.currentDataLogs);
    baccaratMain.miniRoundHistory.setData(currentDataLogs);
  }
}
