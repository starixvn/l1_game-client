import { getStringDateByTime, numberWithCommas } from '../../../common/helpers/Helper';
import * as Pagination from '../../../common/helpers/Pagination/Pagination';
import SicBoHistoryItem from './SicBoHistoryItem';
import SicBoTicketDetail from './SicBoTicketDetail';

const { ccclass, property } = cc._decorator;
@ccclass
export default class SicBoHistory extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(Pagination)
  pages: Pagination = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  ticketDetailPrefab: cc.Prefab = null;

  @property(cc.SpriteFrame)
  dices: cc.SpriteFrame[] = [];

  private socket: SocketIOClient.Socket;

  init(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }

  onLoad() {
    this.pages.init(this);
  }

  onEnable() {
    this.get_data();
  }

  get_data(page = 1) {
    this.socket && this.socket.connected && this.socket.emit('getHistory', { page: page });
  }

  onData(data: any) {
    const { page, pageSize, total, betLogs } = data;

    this.pages.onSet(page, pageSize, total);
    this.content.destroyAllChildren();

    betLogs.forEach((log) => {
      const historyItemPrefab = cc.instantiate(this.itemPrefab);
      const item = historyItemPrefab.getComponent(SicBoHistoryItem);
      this.content.addChild(historyItemPrefab);

      item.timeLabel.string = getStringDateByTime(log.time);
      item.roundLabel.string = log.phien.toString();
      item.dices[0].spriteFrame = this.dices[log.result.dice1 - 1];
      item.dices[1].spriteFrame = this.dices[log.result.dice2 - 1];
      item.dices[2].spriteFrame = this.dices[log.result.dice3 - 1];
      item.amountLabel.string = numberWithCommas(log.totalAmount);
      item.winLabel.string = numberWithCommas(log.betwin);
      item.winLabel.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

      item.time = '';
      item.round = log.phien;
      item.result = log.result;
      item.betLogDetails = log.betLogDetails;
      item.settlementResult = log.settlementResult;

      item.showTicketDetail = (round, time, result, betLogDetails, settlementResult) => {
        this.showTicketDetail(round, time, result, betLogDetails, settlementResult);
      };
    });
  }

  showTicketDetail(round: number, time: string, result: any, betLogDetails: any, settlementResult: any) {
    const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
    const ticketDetailComponent = ticketDetailPrefab.getComponent(SicBoTicketDetail);

    this.node.addChild(ticketDetailPrefab);
    ticketDetailComponent.roundLabel.string = round.toString();
    ticketDetailComponent.dices[0].spriteFrame = this.dices[result.dice1 - 1];
    ticketDetailComponent.dices[1].spriteFrame = this.dices[result.dice2 - 1];
    ticketDetailComponent.dices[2].spriteFrame = this.dices[result.dice3 - 1];
    ticketDetailComponent.setData(betLogDetails, settlementResult);
    ticketDetailComponent.showbetLogs();
  }
}
