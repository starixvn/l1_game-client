import * as _ from "lodash";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import { BetLog, HandResultConst } from "./HoldemPokerTicketHistory";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Games/HolemPoker/HoldemPokerTicketHistoryItem")
export default class HoldemPokerTicketHistoryItem extends cc.Component {
  @property(cc.Label)
  time: cc.Label = null;

  @property(cc.Label)
  round: cc.Label = null;

  @property(cc.Label)
  player: cc.Label = null;

  @property(cc.Label)
  dealer: cc.Label = null;

  @property(cc.Label)
  stake: cc.Label = null;

  @property(cc.Label)
  win: cc.Label = null;

  @property(cc.Node)
  showBg: cc.Node = null;

  renderTicketHistoryItem(log: BetLog, index: number) {
    this.time.string = getStringDateByTime(log.time);
    this.round.string = log.roundId.toString();
    this.win.string = numberWithCommas(log.betWin);
    this.showBg.active = index % 2 === 0 ? false : true;
    if (!log.isFold) {
      const resultPlayer = `holdEmPoker.${HandResultConst[log.playerHandId]}`;
      this.player.string = `${i18n.t(resultPlayer)}`.toUpperCase();
      let dealerResult: string;
      if (log.isQualified) {
        dealerResult = `holdEmPoker.${HandResultConst[log.dealerHandId]}`;
        if (log.isPlayerWin >= 0) {
          this.player.node.color = cc.Color.YELLOW;
        } else {
          this.dealer.node.color = cc.Color.YELLOW;
        }
      } else {
        this.player.node.color = cc.Color.YELLOW;
        dealerResult = `holdEmPoker.${HandResultConst[0]}`;
      }
      this.dealer.string = `${i18n.t(dealerResult)}`.toUpperCase();
    } else {
      let playerResult = `holdEmPoker.fold`;
      this.player.string = `${i18n.t(playerResult)}`;
      this.dealer.node.color = cc.Color.YELLOW;
      this.dealer.string = "-";
    }

    this.stake.string = numberWithCommas(log.stake);
    this.win.node.color = log.betWin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
  }

  openTicketDetail() { }
}
