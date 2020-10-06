import BetBoard from "../../../common/bet-board/view-models/BetBoard";
import PresetBet from "../../../common/preset-bet/view-models/PresetBet";
import { gameIds } from "../../../Configs";
import NewSocketMiniGameBase from "../../_base/NewSocketMiniGameBase";
import SedieMiniRoundHistory from "../../mini-sedie/viewModels/SedieMiniRoundHistory";
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
  betBoardPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  presetBetPrefab: cc.Prefab = null;

  private presetBet: PresetBet;
  private betBoard: BetBoard;
  private presetBetValue = 0;
  private presetBetSettingKey: string;
  private miniRoundHistory: SedieMiniRoundHistory;

  onLoad() {
    super.onLoad();

    this.initRoundHistory();
    this.animatedTime.setAnimatedY(30, -5);

    this.initPresetBetBoard();
    this.initBetBoard();
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new SpecialSeDieTimeHandler(this);
    this.logsHandler = new SpecialSeDieLogsHandler(this);
    this.finishHandler = new SpecialSeDieFinishHandler(this);
  }

  initRoundHistory() {
    var mini = cc.instantiate(this.miniRoundHistoryPrefab);
    this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
    this.miniRoundHistoryContainer.addChild(mini);
  }

  private initPresetBetBoard() {
    const node = cc.instantiate(this.presetBetPrefab);
    this.presetBet = node.getComponent(PresetBet);
    this.presetBet.onChangedBet = (betAmount: number) => {
      this.changedPresetBet(betAmount);
    };
    this.presetBet.getPreset = () => this.presetBetValue;
    this.node.addChild(node);
    node.active = false;

    this.presetBetValue =
      parseFloat(cc.sys.localStorage.getItem(this.presetBetSettingKey)) || 0;
  }

  private changedPresetBet(value: number) {
    this.presetBetValue = value;
    cc.sys.localStorage.setItem(this.presetBetSettingKey, this.presetBetValue);
  }

  protected initBetBoard() {
    const betBoardNode = cc.instantiate(this.betBoardPrefab);
    this.betBoard = betBoardNode.getComponent(BetBoard);
    // this.betBoard.callback = {
    //   getPreset: () => { return this.presetBetValue; },
    //   acceptedBet: (info: BetInfo) => { this.onBetClick(); },
    //   changedBet: (info: BetInfo) => { this.setCurrentBetInput(info.bet); },
    //   cancel: (info: BetInfo) => {
    //     this.resetCurrentBetInput();
    //     this.setBetButtonFrame(false);
    //   },
    // };
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

  public openGuide() {
    let guide = cc.instantiate(this.guidePrefab);
    let specialSedieGuide = guide.getComponent('SpecialSeDieGuide');
    specialSedieGuide.init(this.gameConfigs);
    this.currentMiniPanel.node.addChild(guide);
  }

  public openHistory() {
    let dialog = cc.instantiate(this.historyPrefab);
    let historyComponent = dialog.getComponent('SpecialSeDieHistory');
    historyComponent.init(this.socket);
    this.currentMiniPanel.node.addChild(dialog);
  }

  openPresetBetDialog() {
    cc.RedT.audio.playClick();
    this.presetBet.toggle();
  }
}
