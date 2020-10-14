import * as _ from "lodash";

import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
import { gameIds } from "../../../Configs";
import BalancedBettingPoolGameBase from "../../_base/BalancedBettingPoolGameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import SpecialSeDieBetHandler from "./handlers/SpecialSeDieBetHandler";
import SpecialSeDieFinishHandler from "./handlers/SpecialSeDieFinishHandler";
import SpecialSeDieLogsHandler from "./handlers/SpecialSeDieLogsHandler";
import SpecialSeDieStatusHandler from "./handlers/SpecialSeDieStatusHandler";
import SpecialSeDieTimeHandler from "./handlers/SpecialSeDieTimeHandler";
import SpecialSedieBetHistory from "./SpecialSedieBetHistory";
import SpecialSeDieGuide from "./SpecialSeDieGuide";
import SpecialSeDieHistory from "./SpecialSeDieHistory";
import SpecialSedieRoundHistory from "./SpecialSedieRoundHistory";
import SpecialSeDieStats from "./SpecialSeDieStats";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDie extends BalancedBettingPoolGameBase {
  get gameId() {
    return gameIds.SpecialSeDie;
  }

  @property(cc.Prefab)
  miniRoundHistoryPrefab: cc.Prefab = null;

  @property(cc.Node)
  miniRoundHistoryContainer: cc.Node = null;

  @property(cc.Animation)
  shakeThePlateAnimation: cc.Animation = null;

  @property(cc.Node)
  thePlate: cc.Node = null;

  @property({ type: cc.Sprite })
  dots: cc.Sprite[] = [];

  @property(cc.SpriteFrame)
  dotRed: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  dotWhite: cc.SpriteFrame = null;

  @property(cc.Prefab)
  guidePrefab: cc.Prefab = null;

  @property(cc.Prefab)
  historyPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  statisticPrefab: cc.Prefab = null;

  @property(cc.Label)
  selectedBetAmountLabelLeft: cc.Label = null;

  @property(cc.Label)
  selectedBetAmountLabelRight: cc.Label = null;

  @property(cc.Sprite)
  selectedBetAmountSpriteLeft: cc.Sprite = null;

  @property(cc.Sprite)
  selectedBetAmountSpriteRight: cc.Sprite = null;

  @property(cc.SpriteFrame)
  selectedBetAmountClickedImageLeft: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  selectedBetAmountUnClickedImageLeft: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  selectedBetAmountClickedImageRight: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  selectedBetAmountUnClickedImageRight: cc.SpriteFrame = null;

  @property(cc.Prefab)
  betHistoryPrefab: cc.Prefab = null;

  @property(cc.Label)
  betPercentageLeft: cc.Label = null;

  @property(cc.Label)
  betPercentageRight: cc.Label = null;

  @property(cc.Node)
  randomPosNode: cc.Node = null;

  private miniRoundHistory: SpecialSedieRoundHistory;
  private historyComponent: SpecialSeDieHistory;
  private betHistory: SpecialSedieBetHistory;
  private choice = {
    odd: 'odd',
    even: 'even',
  };

  onLoad() {
    super.onLoad();

    this.selectedBetAmountLabels = {
      [this.choice.even]: this.selectedBetAmountLabelLeft,
      [this.choice.odd]: this.selectedBetAmountLabelRight,
    };
    this.selectedBetAmountSprites = {
      [this.choice.even]: this.selectedBetAmountSpriteLeft,
      [this.choice.odd]: this.selectedBetAmountSpriteRight,
    };
    this.selectedBetAmountClickedImages = {
      [this.choice.even]: this.selectedBetAmountClickedImageLeft,
      [this.choice.odd]: this.selectedBetAmountClickedImageRight,
    };
    this.selectedBetAmountUnClickedImages = {
      [this.choice.even]: this.selectedBetAmountUnClickedImageLeft,
      [this.choice.odd]: this.selectedBetAmountUnClickedImageRight,
    };
    this.betPercentages = {
      [this.choice.even]: this.betPercentageLeft,
      [this.choice.odd]: this.betPercentageRight,
    };

    this.initRoundHistory();
    this.animatedTime.setAnimatedY(30, -5);

    const dragableItem = this.getComponent(DraggableItem);
    dragableItem.touchCallback.start = (node) => {
      this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
    };
  }

  onData(data: any) {
    super.onData(data);
    if (data.history) {
      this.historyComponent.onData(data.history);
    }

    if (data.round) {
      this.betHistory && this.betHistory.onData(data.round);
    }
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new SpecialSeDieTimeHandler(this);
    this.logsHandler = new SpecialSeDieLogsHandler(this);
    this.finishHandler = new SpecialSeDieFinishHandler(this);
    this.betHandler = new SpecialSeDieBetHandler(this);
    this.statusHandler = new SpecialSeDieStatusHandler(this);
  }

  initRoundHistory() {
    var mini = cc.instantiate(this.miniRoundHistoryPrefab);
    this.miniRoundHistory = mini.getComponent(SpecialSedieRoundHistory);
    this.miniRoundHistory.handleBetHistory = (roundId) => {
      this.openBetHistory(roundId);
    };
    this.miniRoundHistoryContainer.addChild(mini);
  }

  updateRoundHistory() {
    const miniHistoryData = this.currentDataLogs.map((log) => {
      let count = 0;
      const { result } = log;
      Object.keys(result).forEach((key) => {
        if (result[key]) {
          count++;
        }
      });
      return {
        roundId: log.roundId || log.id || log.round,
        red: count,
      };
    });
    this.miniRoundHistory.setData(miniHistoryData);
  }

  setDots(result) {
    const optRandom = _.random(0, this.randomPosNode.children.length - 1);
    const randomOption = this.randomPosNode.children[optRandom];

    Object.keys(result).forEach((key, index) => {
      this.dots[index].node.position = randomOption.children[index].position;
      this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
    });
  }

  showResult() {
    if (this.currentDataLogs.length > 0) {
      const { result, settlementResult } = this.currentDataLogs[0];
      this.setDots(result);
      this.betItems.forEach((betItem) => betItem.setHighlight(settlementResult[betItem.node.name.toLowerCase()], true));
      this.updateRoundHistory();

      cc.tween(this.thePlate)
        .call(() => {
          this.shakeThePlateAnimation.node.active = true;
          this.hideBalanceBetNotice();
        })
        .to(0.5, { position: cc.v2(50, 100) }, { easing: 'sineInOut' })
        .call(() => {
          (this.finishHandler as GameBaseFinishHandler).payChips(settlementResult, null);
          this.enableHistoryButton();
          this.finishShowResult = true;
        })
        .to(0.2, { opacity: 0 })
        .start();
    }
  }

  showWinningAnimation() {
    const currentStatusData = this.statusHandler.currentStatusData;
    currentStatusData && currentStatusData.win && this.showWinningBet(currentStatusData.bet);
  }

  public highlightLastResult() {
    if (this.currentTimeRemaining <= this.config.stopBetTime) {
      return;
    }
    const dataLog = this.currentDataLogs[0];
    this.highlightWonItems(dataLog.settlementResult, false);
  }

  private highlightWonItems(settlementResult: any, isAnimated = true) {
    this.betItems.forEach((betItem) => {
      betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
    });
  }

  public openGuide() {
    let guide = cc.instantiate(this.guidePrefab);
    let specialSedieGuide = guide.getComponent(SpecialSeDieGuide);
    specialSedieGuide.init(this.gameConfigs);
    this.currentMiniPanel.node.addChild(guide);
  }

  public openHistory() {
    let dialog = cc.instantiate(this.historyPrefab);
    this.historyComponent = dialog.getComponent(SpecialSeDieHistory);
    this.historyComponent.init(this.socket);
    this.historyComponent.handleBetHistory = (roundId) => {
      this.openBetHistory(roundId);
    };
    this.currentMiniPanel.node.addChild(dialog);
  }

  public openStats() {
    let dialog = cc.instantiate(this.statisticPrefab);
    let statsComponent = dialog.getComponent(SpecialSeDieStats);
    statsComponent.init(this.currentDataLogs);
    this.currentMiniPanel.node.addChild(dialog);
  }

  openBetHistory(roundId: number) {
    let node = cc.instantiate(this.betHistoryPrefab);
    this.betHistory = node.getComponent(SpecialSedieBetHistory);
    this.betHistory.init(this.socket, roundId);
    this.currentMiniPanel.node.addChild(node);
  }

  resetDataAndUI() {
    super.resetDataAndUI();
    this.shakeThePlateAnimation.node.active = false;
    this.statusHandler.currentStatusData = null;
  }
}
