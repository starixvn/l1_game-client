import BetBoard, { BetInfo } from "../../common/bet-board/view-models/BetBoard";
import PresetBet from "../../common/preset-bet/view-models/PresetBet";
import NewSocketMiniGameBase from "./NewSocketMiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BalancedBettingPoolGameBase extends NewSocketMiniGameBase {
  @property(cc.Node)
  betBoardContainer: cc.Node = null;

  @property(cc.Prefab)
  betBoardPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  presetBetPrefab: cc.Prefab = null;

  private presetBet: PresetBet;
  private betBoard: BetBoard;
  private presetBetValue = 0;
  private presetBetSettingKey: string;

  protected selectedBetAmountLabels: { [choice: string]: cc.Label };
  protected selectedBetAmountSprites: { [choice: string]: cc.Sprite };
  protected selectedBetAmountClickedImages: { [choice: string]: cc.SpriteFrame };
  protected selectedBetAmountUnClickedImages: { [choice: string]: cc.SpriteFrame };
  protected betPercentages: { [choice: string]: cc.Label };

  onLoad() {
    super.onLoad();

    if (!cc.sys.isMobile) {
      this.node.scale = 0.8;
    }

    this.initPresetBetBoard();
    this.initBetBoard();
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
    const okButtonPositionY = this.betBoard.okButton.node.parent.convertToWorldSpaceAR(this.betBoard.okButton.node.position).y;
    const expectPositionY = this.betBoard.okButton.node.height;
    const paddingBottom = 20;

    if (okButtonPositionY < expectPositionY) {
      const distance = expectPositionY - okButtonPositionY + paddingBottom;

      this.node.runAction(cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackOut()));
    }
  }

  private initPresetBetBoard() {
    const node = cc.instantiate(this.presetBetPrefab);
    this.presetBet = node.getComponent(PresetBet);
    this.presetBet.onChangedBet = this.changedPresetBet.bind(this);
    this.presetBet.getPreset = this.getPresetBet.bind(this);
    this.node.addChild(node);
    node.active = false;

    this.presetBetValue = parseFloat(cc.sys.localStorage.getItem(this.presetBetSettingKey)) || 0;
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

  openPresetBetDialog() {
    cc.RedT.audio.playClick();
    this.presetBet.toggle();
  }

  showBetPercentage(choice: string, percent: number) {
    const label = this.betPercentages[choice];
    label.string = `${percent} %`;
  }
}
