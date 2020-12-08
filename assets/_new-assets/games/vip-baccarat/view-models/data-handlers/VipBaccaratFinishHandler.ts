import VipBaccarat from '../VipBaccarat';
import GameBaseFinishHandler from '../../../_base/handlers/GameBaseFinishHandler';
import * as _ from 'lodash';
import { getLowercaseObjectKeys } from '../../../../common/helpers/Helper.js';
import VipBaccaratLogsHandler from './VipBaccaratLogsHandler';

export default class VipBaccaratFinishHandler extends GameBaseFinishHandler {
  handleFinishData(dataFinish: any, onFinishHanlingData: () => void = null) {
    super.handleFinishData(dataFinish, onFinishHanlingData);

    var baccaratMain = this.main as VipBaccarat;

    if (!dataFinish.result) {
      return;
    }

    this.showCards(dataFinish, baccaratMain, onFinishHanlingData);
  }

  private showCards(dataFinish: any, baccaratMain: VipBaccarat, onFinishHanlingData: () => void) {
    baccaratMain.showScoreBoardNextDot = true;
    const result = dataFinish.result;
    const settlementResult = dataFinish.settlementResult;
    const player = Object.values(result.player).filter((value) => value != null);
    const banker = Object.values(result.banker).filter((value) => value != null);
    const showResultFunc = () => {
      baccaratMain.showScoreBoardNextDot = false;
      this.showResult(settlementResult);
      this.showWinNotice(settlementResult);
      onFinishHanlingData && onFinishHanlingData();
      if (dataFinish.winningPlayers) {
        delete dataFinish.winningPlayers;
      }

      baccaratMain.currentDataLogs.unshift(dataFinish);
      baccaratMain.currentDataLogs.length > 120 && this.main.currentDataLogs.pop();
      (baccaratMain.logsHandler as VipBaccaratLogsHandler).buildLogs(baccaratMain.currentDataLogs);
      baccaratMain.miniRoundHistory.setData(baccaratMain.currentDataLogs);
    };

    baccaratMain.playerCards.showCards(player, banker.length == 3 ? null : showResultFunc);
    baccaratMain.bankerCards.showCards(banker, banker.length == 3 ? showResultFunc : null, player.length == 3);
  }

  public showResult(resultData, isAnimated = true): void {
    const keys = getLowercaseObjectKeys(resultData);

    _.forEach(this.main.betItems, (item) => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]], isAnimated));
  }

  public showWinNotice(result) {
    const baccaratMain = this.main as VipBaccarat;
    const winNoticeNode = baccaratMain.winNoticeLabel.node.parent;
    let noticeText: string;

    if (result.banker) {
      noticeText = 'NHÀ CÁI THẮNG!';
      baccaratMain.bankerCards.showHighlightCards();
    } else if (result.player) {
      noticeText = 'NHÀ CON THẮNG!';
      baccaratMain.playerCards.showHighlightCards();
    } else {
      noticeText = 'HÒA!';
    }

    baccaratMain.winNoticeLabel.string = noticeText;
    winNoticeNode.active = true;
  }
}
