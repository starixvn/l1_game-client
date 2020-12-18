import VipBaccarat from '../VipBaccarat';
import BaccaratTimeHandler from '../../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler';
import VipBaccaratLogsHandler from './VipBaccaratLogsHandler';

export default class VipBaccaratTimeDataHandler extends BaccaratTimeHandler {
  protected getOwnMain(): any {
    return this.main as VipBaccarat;
  }

  protected handleBuildLogs() {
    (this.main.logsHandler as VipBaccaratLogsHandler).buildLogs(this.main.currentDataLogs);
  }

  protected getSettlementResult(currentData: any){
    return currentData.settlementResult
  }
}
