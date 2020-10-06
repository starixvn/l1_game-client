import { gameIds } from "../../../Configs";
import NewSocketMiniGameBase from "../../_base/NewSocketMiniGameBase";
import SedieMiniRoundHistory from "../../mini-sedie/viewModels/SedieMiniRoundHistory";
import SedieRoundHistory from "../../mini-sedie/viewModels/SedieRoundHistory";
import SpecialSeDieFinishHandler from "./handlers/SpecialSeDieFinishHandler";
import SpecialSeDieLogsHandler from "./handlers/SpecialSeDieLogsHandler";
import SpecialSeDieTimeHandler from "./handlers/SpecialSeDieTimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDie extends NewSocketMiniGameBase {
  get gameId() {
    return gameIds.SpecialSeDie;
  }

  @property(cc.Prefab)
  roundHistoryPrefab: cc.Prefab = null;

  @property(cc.Node)
  roundHistoryContainer: cc.Node = null;

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

  private roundHistory: SedieRoundHistory;
  private miniRoundHistory: SedieMiniRoundHistory;

  onLoad() {
    super.onLoad();

    this.initRoundHistory();
    this.animatedTime.setAnimatedY(30, -5);
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new SpecialSeDieTimeHandler(this);
    this.logsHandler = new SpecialSeDieLogsHandler(this);
    this.finishHandler = new SpecialSeDieFinishHandler(this);
  }

  initRoundHistory() {
    const node = cc.instantiate(this.roundHistoryPrefab);
    this.roundHistory = node.getComponent(SedieRoundHistory);
    const condition = () => {
      return (
        this.currentTimeRemaining < this.config.stopBetTime ||
        this.currentTimeRemaining > this.config.fullTime
      );
    };
    this.roundHistory.logControl.init(condition);
    this.roundHistoryContainer.addChild(node);

    var mini = cc.instantiate(this.miniRoundHistoryPrefab);
    this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
    this.miniRoundHistoryContainer.addChild(mini);
  }

  updateRoundHistory() {
    const miniHistoryData = this.currentDataLogs.map((d) => {
      let count = 0;
      const list = ['red1', 'red2', 'red3', 'red4'];
      list.forEach((i) => {
        if (d.result[i]) {
          count++;
        }
      });
      return {
        roundId: d.roundId || d.id || d.round,
        red: count,
      };
    });
    this.roundHistory.setData(miniHistoryData.map((d) => d.red));
    this.miniRoundHistory.setData(miniHistoryData);
  }

  setDots(result) {
    Object.keys(result).forEach((key, index) => {
      this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
    });
  }

  showResult() {
    if (this.currentDataLogs.length > 0) {
      const { result, settlementResult } = this.currentDataLogs[0];
      this.setDots(result);
      this.betItems.forEach((betItem) =>
        betItem.setHighlight(
          settlementResult[betItem.node.name.toLowerCase()],
          true
        )
      );
      this.updateRoundHistory();
    }
  }
}
