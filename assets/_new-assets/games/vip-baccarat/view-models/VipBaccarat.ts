import { games } from './../../../SabaConfigs';
import { BaccaratConfigs } from '../../baccarat/view-models/BaccaratConfigs';
import NewSocketGameBase from '../../_base/NewSocketGameBase';
import BaccaratCards from '../../baccarat/view-models/BaccaratCards';
import TotalHistoryBoard from '../../baccarat/view-models/TotalHistoryBoard';
import VipBaccaratHistory from './VipBaccaratHistory';
import BasicHistoryBoard from '../../_base/view-models/BasicHistoryBoard';
import DragonScoreBoard from '../../_base/view-models/DragonScoreBoard';
import VipBaccaratFinishHandler from './data-handlers/VipBaccaratFinishHandler';
import BaccaratTimeHandler from '../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler';
import VipBaccaratBetHandler from './data-handlers/VipBaccaratBetHandler';
import VipBaccaratLogsHandler from './data-handlers/VipBaccaratLogsHandler';
import VipBaccaratMiniRoundHistory from './VipBaccaratMiniRoundHistory';

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccarat extends NewSocketGameBase {
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

  @property(cc.Prefab)
  miniRoundHistoryPrefab: cc.Prefab = null;

  @property(cc.Node)
  miniRoundHistoryContainer: cc.Node = null;

  basicHistoryBoard: BasicHistoryBoard;
  detailHistoryBoard: DragonScoreBoard;
  showScoreBoardNextDot = false;
  private miniRoundHistory: VipBaccaratMiniRoundHistory;

  constructor() {
    super();
    this.internalInit();
  }

  protected internalInit() {
    this.init('VipBaccarat', new BaccaratConfigs(), null, 1, games.VipBaccarat.id);
  }

  onLoad() {
    super.onLoad();
    this.initCards();
    this.initScoreBoards();
    this.initMiniRoundHistory();
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new BaccaratTimeHandler(this);
    this.finishHandler = new VipBaccaratFinishHandler(this);
    this.logsHandler = new VipBaccaratLogsHandler(this);
    this.betHandler = new VipBaccaratBetHandler(this);
  }

  onDataGameRoom(data) {
    super.onDataGameRoom(data);
  }

  openHistory() {
    const historyNode = cc.instantiate(this.historyPrefab);
    const history = historyNode.getComponent('BaccaratHistory') as VipBaccaratHistory;
    history.init(this);
    this.currentMiniPanel.node.addChild(historyNode);
  }

  openGuide() {
    const guideNode = cc.instantiate(this.guidePrefab);
    var guide = guideNode.getComponent('BaccaratGuide');
    guide.init(this.gameConfigs);
    this.currentMiniPanel.node.addChild(guideNode);
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

  initMiniRoundHistory() {
    var mini = cc.instantiate(this.miniRoundHistoryPrefab);
    this.miniRoundHistory = mini.getComponent(VipBaccaratMiniRoundHistory);
    this.miniRoundHistoryContainer.addChild(mini);
  }
}
