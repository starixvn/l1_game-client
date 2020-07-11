import SedieRoundHistory from "./SedieRoundHistory";
import MiniSedieFinishHandler from "./handlers/MiniSedieFinishHandler";
import MiniSedieLogsHandler from "./handlers/MiniSedieLogsHandler";
import MiniSedieTimeHandler from "./handlers/MiniSedieTimeHandler";
import SedieMiniRoundHistory from "./SedieMiniRoundHistory";
import GameMiniBase from "../../_base/GameMiniBase";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedie extends GameMiniBase {
  @property({ type: cc.Sprite })
  dots: cc.Sprite[] = [];

  @property(cc.SpriteFrame)
  dotRed: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  dotWhite: cc.SpriteFrame = null;

  @property(cc.Animation)
  animation: cc.Animation = null;

  @property(cc.Prefab)
  roundHistoryPrefab: cc.Prefab = null;

  @property(cc.Node)
  roundHistoryContainer: cc.Node = null;

  @property(cc.Prefab)
  miniRoundHistoryPrefab: cc.Prefab = null;

  @property(cc.Node)
  miniRoundHistoryContainer: cc.Node = null;

  @property(cc.Prefab)
  historyPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  guidePrefab: cc.Prefab = null;

  @property(cc.Node)
  dishNode: cc.Node = null;

  public roundHistory: SedieRoundHistory = null;
  public miniRoundHistory: SedieMiniRoundHistory = null;
  private showLogs = true;
  public resultAnimating = false;

  onLoad() {
    if (!cc.sys.isMobile) {
      this.node.scale = 0.8;
    }
    super.onLoad();
    var node = cc.instantiate(this.roundHistoryPrefab);
    this.roundHistory = node.getComponent(SedieRoundHistory);
    this.roundHistory.init(this);
    this.roundHistoryContainer.addChild(node);

    var mini = cc.instantiate(this.miniRoundHistoryPrefab);
    this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
    this.miniRoundHistoryContainer.addChild(mini);
    this.animatedTime.setAnimatedY(30, -5);
  }

  onDestroy() {
    super.onDestroy();
    this.roundHistoryContainer.isValid &&
      this.roundHistoryContainer.destroyAllChildren();
    this.miniRoundHistoryContainer.isValid &&
      this.miniRoundHistoryContainer.destroyAllChildren();
  }

  onEnable() {
    super.onEnable();
    this.showLogs = this.currentDataLogs.length > 0;
    this.showRoundHistory(this.showLogs);
  }

  initHandlers() {
    super.initHandlers();
    this.finishHandler = new MiniSedieFinishHandler(this);
    this.timeHandler = new MiniSedieTimeHandler(this);
    this.logsHandler = new MiniSedieLogsHandler(this);
  }

  public onBetItemClick(e) {
    cc.RedT.audio.playClick();
    this.bet({ bet: { amount: this.currentBet, betChoice: e.target.name } });
  }

  public showResult() {
    if (this.currentDataLogs.length) {
      const dataLog = this.currentDataLogs[0];
      this.setDots(dataLog.result);
      this.highlightWonItems(dataLog.settlementResult, true);
      this.dishNode.position = cc.v2(0, 150);
      this.dishNode.active = false;
    }
  }

  public highlightLastResult() {
    if (this.currentTimeRemaining <= this.config.stopBetTime) {
      return;
    }
    const dataLog = this.currentDataLogs[0];
    this.highlightWonItems(dataLog.settlementResult, false);
  }

  public setDots(result) {
    Object.keys(result).forEach((key, index) => {
      this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
    });
  }

  private highlightWonItems(settlementResult: any, isAnimated = true) {
    this.betItems.forEach((betItem) => {
      betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
    });
  }

  public updateRoundHistory() {
    const miniHistoryData = this.currentDataLogs.map((d) => {
      let count = 0;
      const list = ["red1", "red2", "red3", "red4"];
      list.forEach((i) => {
        if (d.result[i]) {
          count++;
        }
      });
      return {
        roundId: d.roundId || d.id,
        red: count,
      };
    });
    this.roundHistory.setData(miniHistoryData.map((d) => d.red));
    this.miniRoundHistory.setData(miniHistoryData);
  }

  public onToggleShowRoundResult() {
    this.showLogs = !this.showLogs;
    this.showRoundHistory(this.showLogs);
  }

  public showRoundHistory(show: boolean) {
    this.roundHistoryContainer.active = show;
  }

  public openHistory() {
    let dialog = cc.instantiate(this.historyPrefab);
    this.currentMiniPanel.node.addChild(dialog);
  }

  public openGuide() {
    let dialog = cc.instantiate(this.guidePrefab);
    var guide = dialog.getComponent("XocXoc_guide");
    guide.init(this.gameConfigs);
    this.currentMiniPanel.node.addChild(dialog);
  }
}
