import { games } from './../../../SabaConfigs';
import { BaccaratConfigs } from '../../baccarat/view-models/BaccaratConfigs';
import NewSocketGameBase from '../../_base/NewSocketGameBase';
import BaccaratCards from '../../baccarat/view-models/BaccaratCards';
import TotalHistoryBoard from '../../baccarat/view-models/TotalHistoryBoard';
import BasicHistoryBoard from '../../_base/view-models/BasicHistoryBoard';
import DragonScoreBoard from '../../_base/view-models/DragonScoreBoard';
import BaccaratFinishHandler from '../../baccarat/view-models/data-handlers/BaccaratFInishHandler';
import BaccaratTimeHandler from '../../baccarat/view-models/data-handlers/BaccaratTimeDataHandler';
import VipBaccaratBetHandler from './data-handlers/VipBaccaratBetHandler';
import VipBaccaratLogsHandler from './data-handlers/VipBaccaratLogsHandler';
import Baccarat from '../../baccarat/view-models/Baccarat';

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

  basicHistoryBoard: BasicHistoryBoard;
  detailHistoryBoard: DragonScoreBoard;
  showScoreBoardNextDot = false;
  baccarat: Baccarat;

  constructor() {
    super();
    this.internalInit();
  }

  protected internalInit() {
    this.init('VipBaccarat', new BaccaratConfigs(), null, 1, games.VipBaccarat.id);
  }

  onLoad() {
    super.onLoad();
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new BaccaratTimeHandler(this);
    // this.finishHandler = new BaccaratFinishHandler(this);
    // this.logsHandler = new VipBaccaratLogsHandler(this);
    this.betHandler = new VipBaccaratBetHandler(this);
  }
}
