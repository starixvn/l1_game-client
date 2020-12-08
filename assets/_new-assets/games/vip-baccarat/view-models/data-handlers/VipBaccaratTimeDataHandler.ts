import VipBaccarat from '../VipBaccarat';
import GameBaseTimeHandler from '../../../_base/handlers/GameBaseTimeHandler';
import VipBaccaratLogsHandler from './VipBaccaratLogsHandler';

export default class VipBaccaratTimeDataHandler extends GameBaseTimeHandler {
  handleStartingNewGameRound() {
    super.handleStartingNewGameRound();
    const baccarat = this.main as VipBaccarat;
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
  }

  handleInLockBetTime() {
    super.handleInLockBetTime();

    this.main.betItems.forEach((item) => item.setHighlight(false));

    if (this.main.currentTimeRemaining == this.main.config.stopBetTime && this.main.currentDataLogs.length >= 102) {
      this.main.currentDataLogs.pop();
      (this.main.logsHandler as VipBaccaratLogsHandler).buildLogs(this.main.currentDataLogs);
    }
  }
}
