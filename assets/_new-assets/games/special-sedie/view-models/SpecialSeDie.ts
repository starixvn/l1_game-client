import BetBoard, { BetInfo } from "../../../common/bet-board/view-models/BetBoard";
import PresetBet from "../../../common/preset-bet/view-models/PresetBet";
import { gameIds } from "../../../Configs";
import NewSocketMiniGameBase from "../../_base/NewSocketMiniGameBase";
import SpecialSeDieBetHandler from "./handlers/SpecialSeDieBetHandler";
import SpecialSeDieFinishHandler from "./handlers/SpecialSeDieFinishHandler";
import SpecialSeDieLogsHandler from "./handlers/SpecialSeDieLogsHandler";
import SpecialSeDieTimeHandler from "./handlers/SpecialSeDieTimeHandler";
import SpecialSeDieGuide from "./SpecialSeDieGuide";
import SpecialSeDieHistory from "./SpecialSeDieHistory";
import SpecialSedieRoundHistory from "./SpecialSedieRoundHistory";
import SpecialSeDieStats from "./SpecialSeDieStats";

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
  statisticPrefab: cc.Prefab = null;

  @property(cc.Node)
  betBoardContainer: cc.Node = null;

  @property(cc.Prefab)
  betBoardPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  presetBetPrefab: cc.Prefab = null;

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

  private presetBet: PresetBet;
  private betBoard: BetBoard;
  private presetBetValue = 0;
  private presetBetSettingKey: string;
  private miniRoundHistory: SpecialSedieRoundHistory;
  private selectedBetAmountLabels = {};
  private selectedBetAmountSprites = {};
  private selectedBetAmountClickedImages = {};
  private selectedBetAmountUnClickedImages = {};
  private betPercentages: {[choice:string] : cc.Label};
  private historyComponent: SpecialSeDieHistory;

  onLoad() {
    if (!cc.sys.isMobile) {
      this.node.scale = 0.8;
    }

    super.onLoad();
    this.selectedBetAmountLabels = {
      ['even']: this.selectedBetAmountLabelLeft,
      ['odd']: this.selectedBetAmountLabelRight,
    };

    this.selectedBetAmountSprites = {
      ['even']: this.selectedBetAmountSpriteLeft,
      ['odd']: this.selectedBetAmountSpriteRight,
    };

    this.selectedBetAmountClickedImages = {
      ['even']: this.selectedBetAmountClickedImageLeft,
      ['odd']: this.selectedBetAmountClickedImageRight,
    };

    this.selectedBetAmountUnClickedImages = {
      ['even']: this.selectedBetAmountUnClickedImageLeft,
      ['odd']: this.selectedBetAmountUnClickedImageRight,
    };

    this.betPercentages = {
      ['even']: this.betPercentageLeft,
      ['odd']: this.betPercentageRight
    };

    this.initRoundHistory();
    this.animatedTime.setAnimatedY(30, -5);

    this.initPresetBetBoard();
    this.initBetBoard();
  }

  onData(data: any) {
    super.onData(data);
    if (data.history) {
      this.historyComponent.onData(data.history);
    }
  }

  initHandlers() {
    super.initHandlers();

    this.timeHandler = new SpecialSeDieTimeHandler(this);
    this.logsHandler = new SpecialSeDieLogsHandler(this);
    this.finishHandler = new SpecialSeDieFinishHandler(this);
    this.betHandler= new SpecialSeDieBetHandler(this);
  }

  initRoundHistory() {
    var mini = cc.instantiate(this.miniRoundHistoryPrefab);
    this.miniRoundHistory = mini.getComponent(SpecialSedieRoundHistory);
    this.miniRoundHistory.handleBetHistory = (roundId) => {
      this.openBetHistory(roundId);
    }
    this.miniRoundHistoryContainer.addChild(mini);
  }

  onSelectBetChoiceClick(event: cc.Event, choice: string) {
    this.setSelectedBetAmountSpriteFrame(choice, true);
    const betInfo = {
      choice: choice,
      bet: 0,
      betItem: null,
      maxBet: this.gameConfigs.choices_maxbet[choice],
    };
    this.betBoard.show(betInfo);
    this.betBoard.node.runAction(
      cc.sequence(
        cc.delayTime(0.05),
        cc.callFunc(() => {
          this.adjustPosition();
        })
      )
    );
  }

  protected adjustPosition() {
    const okButtonPositionY = this.betBoard.okButton.node.parent.convertToWorldSpaceAR(
      this.betBoard.okButton.node.position
    ).y;
    const expectPositionY = this.betBoard.okButton.node.height;
    const paddingBottom = 20;

    if (okButtonPositionY < expectPositionY) {
      const distance = expectPositionY - okButtonPositionY + paddingBottom;

      this.node.runAction(
        cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackOut())
      );
    }
  }

  private initPresetBetBoard() {
    const node = cc.instantiate(this.presetBetPrefab);
    this.presetBet = node.getComponent(PresetBet);
    this.presetBet.onChangedBet = this.changedPresetBet.bind(this);
    this.presetBet.getPreset = this.getPresetBet.bind(this);
    this.node.addChild(node);
    node.active = false;

    this.presetBetValue =
      parseFloat(cc.sys.localStorage.getItem(this.presetBetSettingKey)) || 0;
  }

  private changedPresetBet(value: number) {
    this.presetBetValue = value;
    cc.sys.localStorage.setItem(this.presetBetSettingKey, this.presetBetValue);
  }

  private getPresetBet() {
    return this.presetBetValue;
  }

  protected initBetBoard() {
    const betBoardNode = cc.instantiate(this.betBoardPrefab);
    this.betBoard = betBoardNode.getComponent(BetBoard);
    this.betBoard.callback = {
      getPreset: this.getPresetBet.bind(this),
      acceptedBet: this.onAcceptedBet.bind(this),
      changedBet: this.onChangedBet.bind(this),
      cancel: this.onCancelBet.bind(this),
    };

    this.betBoardContainer && this.betBoardContainer.addChild(betBoardNode);
    this.betBoard.node.active = false;
  }

  onAcceptedBet(info: BetInfo) {
    if (!this.validateBet()) {
      return;
    }

    const { choice, bet } = info;
    this.sendBetRequest(choice, bet);
    this.resetSelectedBetAmountLabel(choice);
    this.setSelectedBetAmountSpriteFrame(choice, false);
  }

  onChangedBet(info: BetInfo) {
    const { bet, choice } = info;
    const maxBet = this.gameConfigs.choices_maxbet[choice];
    const betAmount = bet > maxBet ? maxBet : bet;
    const selectedBetAmountLabel = this.selectedBetAmountLabels[choice];
    selectedBetAmountLabel.string = betAmount;
  }

  onCancelBet(info: BetInfo) {
    const { choice } = info;
    this.resetSelectedBetAmountLabel(choice);
    this.setSelectedBetAmountSpriteFrame(choice, false);
  }

  resetSelectedBetAmountLabel(choice: string) {
    const selectedBetAmountLabel = this.selectedBetAmountLabels[choice];
    selectedBetAmountLabel.string = 'ĐẶT CỬA';
  }

  setSelectedBetAmountSpriteFrame(choice: string, isClicked: boolean) {
    const selectedBetAmountSprite = this.selectedBetAmountSprites[choice];
    selectedBetAmountSprite.spriteFrame = isClicked
      ? this.selectedBetAmountClickedImages[choice]
      : this.selectedBetAmountUnClickedImages[choice];
  }

  validateBet() {
    if (this.isDisableGame) {
      return false;
    }

    if (this.waitingProcessing) {
      this.showProcessingWarning(true);
      return false;
    } else {
      this.waitingProcessing = true;
      return true;
    }
  }

  sendBetRequest(choice: string, amount: number) {
    const betData = {
      amount: amount,
      betChoice: choice,
    };
    this.socket && this.socket.emit('bet', betData);
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
    }
    this.currentMiniPanel.node.addChild(dialog);
  }

  public openStats() {
    let dialog = cc.instantiate(this.statisticPrefab);
    let statsComponent = dialog.getComponent(SpecialSeDieStats);
    statsComponent.init(this.currentDataLogs);
    this.currentMiniPanel.node.addChild(dialog);
  }

  openPresetBetDialog() {
    cc.RedT.audio.playClick();
    this.presetBet.toggle();
  }

  openBetHistory(roundId: number) {
    let bethistory = cc.instantiate(this.betHistoryPrefab);
    this.currentMiniPanel.node.addChild(bethistory);
  }

  showBetPercentage(choice: string, percent: number){
    const label = this.betPercentages[choice];
    label.string = `${percent} %`;
  }

  resetDataAndUI(){
    super.resetDataAndUI();
    this.betPercentageLeft.string = "0 %";
    this.betPercentageRight.string = "0 %";
  }
}
