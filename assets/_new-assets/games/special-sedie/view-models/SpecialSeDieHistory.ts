import GameUtils from "./../../../common/GameUtils";
import { getStringDateByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import * as Pagination from "./../../../common/helpers/Pagination/Pagination";
import SpecialSeDieHistoryItem from "./SpecialSeDieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieHistory extends cc.Component {
  @property(Pagination)
  pagination: Pagination = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.SpriteFrame)
  iconRed: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  iconWhite: cc.SpriteFrame = null;

  private socket: SocketIOClient.Socket;

  public handleBetHistory = (roundId) => {};

  init(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }

  onLoad() {
    this.pagination.init(this);
  }

  onEnable() {
    this.get_data();
  }

  onDisable() {
    this.node.destroy();
  }

  get_data(page = 1) {
    this.socket.emit('getHistory', { page: page });
  }

  onData(data) {
    const { page, pageSize, total, betLogs } = data;
    this.pagination.onSet(page, pageSize, total);
    this.content.destroyAllChildren();

    if (betLogs && betLogs.length) {
      betLogs.map((betLog, index) => {
        let itemNode = cc.instantiate(this.itemPrefab);
        let item = itemNode.getComponent(SpecialSeDieHistoryItem);
        item.node.active = true;
        item.bg.active = index % 2 > 0;

        const { time, phien, result, betwin, choice, amount, refund, win } = betLog;

        item.time.string = getStringDateByTime(time);
        item.time.node.color = win ? cc.Color.YELLOW : cc.Color.WHITE;

        item.phien.string = phien;

        let number = 0;
        Object.keys(result).forEach((key) => {
          if (result[key]) {
            number++;
          }
        });

        item.kqLabel.string = number.toString();
        if (number % 2) {
          item.kqSprite.spriteFrame = this.iconRed;
          item.kqLabel.node.color = cc.Color.WHITE;
        } else {
          item.kqSprite.spriteFrame = this.iconWhite;
          item.kqLabel.node.color = cc.Color.BLACK;
        }
        item.option.string = GameUtils.getBetChoiceString(choice);
        item.option.node.color = win ? cc.Color.YELLOW : cc.Color.WHITE;

        item.bet.string = numberWithCommas(amount);
        item.refund.string = numberWithCommas(refund);
        item.roundId = phien;

        item.win.string = numberWithCommas(betwin);
        item.win.node.color = win ? cc.Color.YELLOW : cc.Color.WHITE;

        item.handleRoundIdClick = (roundId) => {
          this.openBetHistory(roundId);
        };

        this.content.addChild(itemNode);
      });
    }
  }

  openBetHistory(roundId: number) {
    this.handleBetHistory(roundId);
  }
}
