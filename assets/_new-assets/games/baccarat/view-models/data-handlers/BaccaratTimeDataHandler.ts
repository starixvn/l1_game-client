import Baccarat from '../Baccarat';
import GameBaseTimeHandler from '../../../_base/handlers/GameBaseTimeHandler';
import BaccaratLogsHandler from './BaccaratLogsHandler';
import BaccaratFinishHandler from './BaccaratFinishHandler';

export default class BaccaratTimeHandler extends GameBaseTimeHandler {
  handleStartingNewGameRound() {
    super.handleStartingNewGameRound();
    const baccarat = this.getOwnMain();
    baccarat.bankerCards.resetCards();
    baccarat.playerCards.resetCards();

    this.main.node.runAction(
      cc.sequence(
        cc.delayTime(0.5),
        cc.callFunc(() => baccarat.playerCards.flyFirstCard()),
        cc.delayTime(0.5),
        cc.callFunc(() => baccarat.bankerCards.flyFirstCard()),
        cc.delayTime(0.5),
        cc.callFunc(() => baccarat.playerCards.flySecondCard()),
        cc.delayTime(0.5),
        cc.callFunc(() => baccarat.bankerCards.flySecondCard())
      )
    );

    if (this.main.currentDataLogs[0]) {
      let currentData = this.main.currentDataLogs[0];
      const finishHandler = this.main.finishHandler as BaccaratFinishHandler;
      finishHandler.showResult(this.getSettlementResult(currentData), false);
    }
  }

  handleInLockBetTime() {
    super.handleInLockBetTime();

    this.main.betItems.forEach((item) => item.setHighlight(false));

    if (this.main.currentTimeRemaining == this.main.config.stopBetTime && this.main.currentDataLogs.length >= 102) {
      this.main.currentDataLogs.pop();
      this.handleBuildLogs();
    }
  }

  protected getOwnMain(): any {
    return this.main as Baccarat;
  }

  protected handleBuildLogs() {
    (this.main.logsHandler as BaccaratLogsHandler).buildLogs(this.main.currentDataLogs);
  }

  protected getSettlementResult(currentData: any) {
    return currentData.result;
  }
}
