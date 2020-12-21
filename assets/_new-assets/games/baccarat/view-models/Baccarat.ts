import GameUtils from '../../../common/GameUtils';
import GameRoomBase from '../../_base/GameRoomBase';
import BasicHistoryBoard from '../../_base/view-models/BasicHistoryBoard';
import DragonScoreBoard from '../../_base/view-models/DragonScoreBoard';
import { games } from './../../../SabaConfigs';
import BaccaratCards from './BaccaratCards';
import { BaccaratConfigs } from './BaccaratConfigs';
import BaccaratHistory from './BaccaratHistory';
import BaccaratFinishHandler from './data-handlers/BaccaratFinishHandlerRename';
import BaccaratLogsHandler from './data-handlers/BaccaratLogsHandler';
import BaccaratTimeHandler from './data-handlers/BaccaratTimeDataHandler';
import TotalHistoryBoard from './TotalHistoryBoard';

const { ccclass, property } = cc._decorator;
@ccclass
export default class Baccarat extends GameRoomBase {
  @property(BaccaratCards)
  playerCards: BaccaratCards = null;

  @property(BaccaratCards)
  bankerCards: BaccaratCards = null;

  @property(cc.Node)
  basicHistoryBoardNode: cc.Node = null;

  @property(cc.Prefab)
  basicHistoryBoardPrefab: cc.Prefab = null;

  @property(cc.Node)
  detailHistoryBoardNode: cc.Node = null;

  @property(cc.Prefab)
  detailHistoryBoardPrefab: cc.Prefab = null;

  @property(TotalHistoryBoard)
  totalHistoryBoard: TotalHistoryBoard = null;

  @property(cc.Prefab)
  historyPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  guidePrefab: cc.Prefab = null;

  @property(cc.Label)
  winNoticeLabel: cc.Label = null;

  @property(cc.AudioSource)
  getCardAudioSource: cc.AudioSource = null;

  @property(cc.Node)
  chipContainer: cc.Node = null;

  @property(cc.Node)
  totalBetContainer: cc.Node = null;

  @property(cc.Node)
  ownBetContainer: cc.Node = null;

  basicHistoryBoard: BasicHistoryBoard;
  detailHistoryBoard: DragonScoreBoard;
  showScoreBoardNextDot = false;

  onLoad() {
    this.init('baccarat', new BaccaratConfigs(), null, 1, games.Baccarat.id);
    super.onLoad();
    this.initCards();
    this.initScoreBoards();

    this.betItems.forEach((item) => {
      GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
      GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
      GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
    });
  }

  onData(data) {
    super.onData(data);
  }

  onDataGameRoom(data) {
    super.onDataGameRoom(data);
  }

  onBet(event, box) {
    this.bet({ bet: { red: true, bet: this.currentBet, box: box } });
  }

  openHistory() {
    const historyNode = cc.instantiate(this.historyPrefab);
    const history = historyNode.getComponent('BaccaratHistory') as BaccaratHistory;
    history.init(this);
    this.currentMiniPanel.node.addChild(historyNode);
  }

  openGuide() {
    const guideNode = cc.instantiate(this.guidePrefab);
    var guide = guideNode.getComponent('BaccaratGuide');
    guide.init(this.gameConfigs);
    this.currentMiniPanel.node.addChild(guideNode);
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new BaccaratTimeHandler(this);
    this.finishHandler = new BaccaratFinishHandler(this);
    this.logsHandler = new BaccaratLogsHandler(this);
  }

  resetDataAndUI() {
    super.resetDataAndUI();

    this.winNoticeLabel.node.parent.active = false;
  }

  playGetCardAudio() {
    this.getCardAudioSource.play();
  }

  private initCards() {
    this.bankerCards.init(() => {
      this.playGetCardAudio();
    });
    this.playerCards.init(() => {
      this.playGetCardAudio();
    });
  }

  private initScoreBoards() {
    const condition = () => {
      const result = this.currentTimeRemaining < this.config.stopBetTime || this.showScoreBoardNextDot;

      return result;
    };

    const historyBoardNode = cc.instantiate(this.basicHistoryBoardPrefab);
    this.basicHistoryBoard = historyBoardNode.getComponent('BasicHistoryBoard');
    this.basicHistoryBoard.init(condition);
    this.basicHistoryBoardNode.addChild(historyBoardNode);

    const detailHistoryBoardNode = cc.instantiate(this.detailHistoryBoardPrefab);
    this.detailHistoryBoard = detailHistoryBoardNode.getComponent('BaccaratDragonScoreBoard');
    this.detailHistoryBoard.init(condition);
    this.detailHistoryBoardNode.addChild(detailHistoryBoardNode);
  }
}
