import { getOnlyNumberInString, numberTo, numberWithCommas } from "../../../../common/helpers/Helper";
import UmWarning from "../../../../common/um-warning/UmWarning";
import GameAudios from "../../../_base/GameAudios";
import DataHandler from "../../../_base/handlers/DataHandler";
import AnimatedTime from "./../../../../common/animated-time/view-models/AnimatedTime";
import BetBoard, { BetInfo } from "./../../../../common/bet-board/view-models/BetBoard";
import ProcessingWarning from "./../../../../common/processing-warning/view-models/ProcessingWarning";
import * as ScaleEffect from "./../../../tai-xiu/view-models/main-page/TXScale";
import ChanLe from "./../ChanLe";
import DiaNan from "./ChanLeDiaNan";
import BetStatusDataHandler from "./data-handlers/BetStatusDataHandler";
import ErrorDataHandler from "./data-handlers/ErrorDataHandler";
import FinishTurnDataHandler from "./data-handlers/FinishTurnDataHandler";
import GameDataHandler from "./data-handlers/GameDataHandler";
import LogsDataHandler, { ILogsDataHandler } from "./data-handlers/LogsDataHandler";
import TimeDataHandler, { ITimeDataHandler } from "./data-handlers/TimeDataHandler";
import UMDataHandler from "./data-handlers/UMDataHandler";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ChanLeMain extends cc.Component {
    //#region Properties
    @property({ type: cc.Node, override: true })
    public background: cc.Node = null;

    @property({ type: cc.Animation, override: true })
    public diceAnimation: cc.Animation = null;

    @property(cc.Label)
    public betInputLeft: cc.Label = null;

    @property(cc.Label)
    public betInputRight: cc.Label = null;

    @property(cc.Sprite)
    public betButtonSpriteLeft: cc.Sprite = null;

    @property(cc.Sprite)
    public betButtonSpriteRight: cc.Sprite = null;

    @property(cc.Label)
    public totalBetLeft: cc.Label = null;

    @property(cc.Label)
    public totalBetRight: cc.Label = null;

    @property(cc.Label)
    public userBetLeft: cc.Label = null;

    @property(cc.Label)
    public userBetRight: cc.Label = null;

    @property(cc.Label)
    public playersLeft: cc.Label = null;

    @property(cc.Label)
    public playersRight: cc.Label = null;

    @property(cc.Node)
    public resultNode: cc.Node = null;

    @property(cc.Label)
    public resultLabel: cc.Label = null;

    @property(cc.SpriteFrame)
    public betButtonClickedImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    public betButtonUnClickedImage: cc.SpriteFrame = null;

    @property({ type: DiaNan })
    public diaNan: DiaNan = null;

    @property({ type: cc.Node })
    public centerRoundLight: cc.Node = null;

    @property({ type: cc.Node })
    public notice: cc.Node = null;

    @property({ type: cc.Sprite })
    public diaNanSprite: cc.Sprite = null;

    @property({ type: [cc.SpriteFrame] })
    public diaNanSpriteFrames: cc.SpriteFrame[] = [];

    @property({ type: cc.Label })
    public phienLabel: cc.Label = null;

    @property({ type: [cc.Sprite] })
    public dices: cc.Sprite[] = [];

    @property({ type: [cc.SpriteFrame] })
    public diceFrames: cc.SpriteFrame[] = [];

    @property({ type: cc.Prefab })
    public processingWarningPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    public miniWarningPrefab: cc.Prefab = null;

    @property({ type: UmWarning })
    public noticeUM: UmWarning = null;

    @property({ type: cc.Node })
    public dotLogs: cc.Node = null;

    @property({ type: cc.SpriteFrame })
    public dotBlack: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })
    public dotWhite: cc.SpriteFrame = null;

    @property({ type: cc.BitmapFont })
    public fontPlus: cc.BitmapFont = null;

    @property({ type: cc.BitmapFont })
    public fontMinus: cc.BitmapFont = null;

    @property({ type: ScaleEffect })
    public leftWinningEffect: ScaleEffect = null;

    @property({ type: ScaleEffect })
    public rightWinningEffect: ScaleEffect = null;

    @property({ type: cc.Animation })
    public leftWinningAnimation: cc.Animation = null;

    @property({ type: cc.Animation })
    public rightWinningAnimation: cc.Animation = null;

    @property({ type: cc.Label })
    public timeWaitLabel: cc.Label = null;

    @property({ type: cc.Node })
    public timeWaitNode: cc.Node = null;

    @property({ type: AnimatedTime })
    public animatedTime: AnimatedTime = null;

    @property(cc.Prefab)
    gameAudiosPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    balanceBetNoticePrefab: cc.Prefab = null;

    @property(cc.Node)
    balanceBetNoticeContainer: cc.Node = null;

    @property(cc.Node)
    historyButton: cc.Node = null;

    @property(cc.Node)
    betBoardContainer: cc.Node = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    //#endregion
    isNan = false;
    root: ChanLe;
    isDisabled = false;
    currentResultDices: number[];
    currentTimeRemaining: number;
    currentStatus: any;
    hideDiaNan: boolean;
    gameAudios: GameAudios;
    redChan: number;
    redLe: number;

    public betBoard: BetBoard;
    public presetBetValue = 0;

    private static readonly MAX_BET = 2000;
    private static readonly DAT_CUOC = "ĐẶT CỬA";
    private readonly umDataHandler: DataHandler;
    private readonly errorDataHandler: DataHandler;
    private readonly gameDataHandler: DataHandler;
    private readonly logsDataHandler: ILogsDataHandler;
    private readonly betStatusDataHandler: DataHandler;
    private readonly timeDataHandler: ITimeDataHandler;
    private readonly finishTurnDataHandler: DataHandler;

    private readonly betChoice = {
        left: "left",
        right: "right"
    };
    private waitingBetResponse = false;
    private processingWarning: ProcessingWarning;
    private currentInputBet: cc.Label;
    private currentInputSide: string;
    private balanceBetNotice: cc.Node = null;

    get dataLogs() {
        return this.logsDataHandler.dataLogs;
    }

    constructor() {
        super();

        this.umDataHandler = new UMDataHandler(this);
        this.errorDataHandler = new ErrorDataHandler(this);
        this.gameDataHandler = new GameDataHandler(this);
        this.logsDataHandler = new LogsDataHandler(this);
        this.betStatusDataHandler = new BetStatusDataHandler(this);
        this.timeDataHandler = new TimeDataHandler(this, this.logsDataHandler);
        this.finishTurnDataHandler = new FinishTurnDataHandler(this, this.timeDataHandler, this.logsDataHandler);
    }

    init(root: ChanLe, hideDiaNan: boolean) {
        this.root = root;
        this.hideDiaNan = hideDiaNan;
        this.diaNan.init(this);
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
        this.animatedTime.node.active = false;
        this.diceAnimation.on("finished", this.onDiceAnimationFinished, this);
        this.playCenterLight();
        this.logsDataHandler.initDotLogs();
        this.initGameAudios();
        this.initBetBoard();
    }

    protected initGameAudios() {
        var gameAudiosNode = cc.instantiate(this.gameAudiosPrefab);
        this.gameAudios = gameAudiosNode.getComponent("GameAudios") as GameAudios;
    }

    onData(data: any) {
        if (this.umDataHandler.handle(data)) {
            return;
        }

        this.errorDataHandler.handle(data);
        this.gameDataHandler.handle(data);
        this.logsDataHandler.handle(data);
        this.betStatusDataHandler.handle(data);
        this.timeDataHandler.handle(data);
        this.finishTurnDataHandler.handle(data);
    }

    onGameHide() {
        this.timeDataHandler.stopPlayTime();
        this.resetUI();
        this.resetData();
        this.centerRoundLight.stopAllActions();
    }

    onBetClick() {
        var bet = getOnlyNumberInString(this.currentInputBet.string);
        bet = parseInt(bet);
        this.resetCurrentBetInput();
        this.betBoard.node.active = false;
        this.setBetButtonFrame(false);

        if (this.waitingBetResponse) {
            this.showBetProcessWarning();
            return;
        }

        this.waitingBetResponse = true;
        this.root.sendData({
            cuoc: {
                red: true,
                select: this.currentInputSide === this.betChoice.left,
                bet: bet
            }
        });
    }

    onDiaNanClick() {
        this.isNan = !this.isNan;
        this.diaNanSprite.spriteFrame = this.isNan ? this.diaNanSpriteFrames[1] : this.diaNanSpriteFrames[0];
    }

    onSelectBetInput(event, select: string) {
        this.setBetButtonFrame(true, select);
        this.currentInputSide = select;

        switch (select) {
            case this.betChoice.right:
                this.currentInputBet = this.betInputRight;
                break;

            case this.betChoice.left:
                this.currentInputBet = this.betInputLeft;
                break;
        }
        const info = {
            choice: select,
            bet: 0,
            betItem: null,
            maxBet: ChanLeMain.MAX_BET
        };
        this.betBoard.show(info);
        this.betBoard.node.runAction(
            cc.sequence(
                cc.delayTime(0.05),
                cc.callFunc(() => {
                    this.adjustPosition();
                })
            )
        );
    }

    setCurrentBetInput(value: number): void {
        this.currentInputBet.string = numberWithCommas(value > ChanLeMain.MAX_BET ? ChanLeMain.MAX_BET : value);
        this.currentInputBet.node.active = true;
    }

    resetCurrentBetInput(select = ""): void {
        if (!select || select === this.betChoice.left) {
            this.betInputLeft.string = ChanLeMain.DAT_CUOC;
        }
        if (!select || select === this.betChoice.right) {
            this.betInputRight.string = ChanLeMain.DAT_CUOC;
        }
    }

    clearCurrentBetInput(): void {
        this.currentInputBet.string = "";
    }

    setBetButtonFrame(isClick: boolean, select = "") {
        if (!select) {
            this.betButtonSpriteRight.spriteFrame = this.getBetButtonSpriteFrame(isClick);
            this.betButtonSpriteLeft.spriteFrame = this.getBetButtonSpriteFrame(isClick);
        } else {
            if (select === this.betChoice.right) {
                this.betButtonSpriteRight.spriteFrame = this.getBetButtonSpriteFrame(isClick);
            }

            if (select === this.betChoice.left) {
                this.betButtonSpriteLeft.spriteFrame = this.getBetButtonSpriteFrame(isClick);
            }
        }
    }

    getBetButtonSpriteFrame(isClick: boolean): cc.SpriteFrame {
        return isClick ? this.betButtonClickedImage : this.betButtonUnClickedImage;
    }

    setTurnLabel(turnId) {
        if (turnId) {
            this.phienLabel.string = `#${turnId}`;
        }
    }

    onDiceAnimationFinished() {
        this.showDices(true);
        this.logsDataHandler.buildDotLogs(this.logsDataHandler.dataLogs);
        !this.isNan && this.showBetResult();
        this.diceAnimation.node.active = false;
    }

    showDices(showDice = false, showDiceSprite = true) {
        Promise.all(
            this.dices.map((dice, index) => {
                if (showDiceSprite) {
                    dice.spriteFrame = this.diceFrames[this.currentResultDices[index] - 1];
                }
                dice.node.active = showDice;
            })
        );
    }

    showBetResult() {
        var point = this.showResultPoint();
        this.stopWinningAnims();

        if (point % 2) {
            this.rightWinningEffect.play();
            this.rightWinningAnimation.node.active = true;
            this.rightWinningAnimation.play();
        } else {
            this.leftWinningEffect.play();
            this.leftWinningAnimation.node.active = true;
            this.leftWinningAnimation.play();
        }
    }

    showResultPoint(): number {
        var point = this.currentResultDices[0] + this.currentResultDices[1] + this.currentResultDices[2];
        this.resultLabel.string = point.toString();
        this.resultNode.active = true;

        return point;
    }

    stopWinningAnims() {
        this.leftWinningEffect.stop();
        this.rightWinningEffect.stop();
        this.leftWinningAnimation.node.active = false;
        this.leftWinningAnimation.stop();
        this.rightWinningAnimation.node.active = false;
        this.rightWinningAnimation.stop();
    }

    showMiniWarning(message) {
        var miniWarningPrefab = cc.instantiate(this.miniWarningPrefab);
        var miniWarning = miniWarningPrefab.getComponent("mini_warning");
        miniWarning.text.string = message;
        this.notice.addChild(miniWarningPrefab);
    }

    showBetProcessWarning() {
        var processingWarningNode = cc.instantiate(this.processingWarningPrefab);
        this.processingWarning = processingWarningNode.getComponent("ProcessingWarning");
        this.notice.addChild(processingWarningNode);
    }

    closeProcessWarning() {
        this.waitingBetResponse = false;

        if (this.processingWarning) {
            this.processingWarning.close();
        }
    }

    playCenterLight() {
        this.centerRoundLight.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    }

    resetUI() {
        this.stopWinningAnims();
        this.hideBetBalanceNotice();
        this.enableHistoryButton();
        this.animatedTime.node.active = false;
        this.diceAnimation.node.active = false;
        this.timeWaitNode.active = this.resultNode.active = this.diaNan.node.active = false;
        this.showDices(false, false);
    }

    resetData() {
        this.totalBetLeft.string = this.totalBetRight.string = this.userBetLeft.string = this.userBetRight.string = "0";
        this.playersLeft.string = this.playersRight.string = "0%";
    }

    balanceBet(showNotice = false) {
        const hasAnimation = showNotice && !this.balanceBetNotice;
        if (hasAnimation) {
            this.balanceBetNotice = cc.instantiate(this.balanceBetNoticePrefab);
            this.balanceBetNoticeContainer.addChild(this.balanceBetNotice);
        }

        const isLechChan = this.redChan > this.redLe;
        if (isLechChan) {
            if (hasAnimation) {
                numberTo(this.totalBetLeft, 0, this.redLe, 1000, true);
            } else {
                this.totalBetLeft.string = numberWithCommas(this.redLe);
            }
            this.totalBetRight.string = numberWithCommas(this.redLe);
        } else {
            if (hasAnimation) {
                numberTo(this.totalBetRight, 0, this.redChan, 1000, true);
            } else {
                this.totalBetRight.string = numberWithCommas(this.redChan);
            }
            this.totalBetLeft.string = numberWithCommas(this.redChan);
        }
    }

    hideBetBalanceNotice() {
        this.balanceBetNoticeContainer.destroyAllChildren();
        this.balanceBetNotice = null;
    }

    disableHistoryButton() {
        this.historyButton.opacity = 130;
        const button = this.historyButton.getComponent(cc.Button);
        button.interactable = false;
    }

    enableHistoryButton() {
        this.historyButton.opacity = 255;
        const button = this.historyButton.getComponent(cc.Button);
        button.interactable = true;
    }

    showResult() {
        if (this.isNan) {
            this.diaNan.node.active = true;
            this.diaNan.node.position = cc.v2(0, -39.5);
            this.diaNanSprite.node.active = false;
            this.onDiceAnimationFinished();
        } else {
            this.diceAnimation.node.active = true;
            this.diceAnimation.play();
        }
    }

    showUserWinLoss(data) {
        setTimeout(() => {
            if (!this.isNan) {
                this.showUserWinLossAnimation(data);
            }
            this.root.sendData({ get_new: true });
        }, 1000);
    }

    private showUserWinLossAnimation(data) {
        if (!this.notice) {
            return;
        }

        var resultNode = new cc.Node();
        resultNode.addComponent(cc.Label);
        var resultLabel = resultNode.getComponent(cc.Label);
        resultLabel.string = (data.win ? "+" : "-") + numberWithCommas(data.bet);
        resultLabel.font = data.win ? this.fontPlus : this.fontMinus;
        resultLabel.lineHeight = 130;
        resultLabel.fontSize = 25;
        resultLabel.node.position = cc.v2(data.select ? -245 : 245, -50);
        this.notice.addChild(resultLabel.node);
        resultLabel.node.runAction(
            cc.sequence(
                cc.moveTo(2, cc.v2(data.select ? -245 : 245, 130)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, resultLabel)
            )
        );
    }

    protected initBetBoard() {
        const betBoardNode = cc.instantiate(this.betBoardPrefab);
        this.betBoard = betBoardNode.getComponent(BetBoard);
        this.betBoard.callback = {
            getPreset: () => {
                return this.presetBetValue;
            },
            acceptedBet: (info: BetInfo) => {
                this.onBetClick();
            },
            changedBet: (info: BetInfo) => {
                this.setCurrentBetInput(info.bet);
            },
            cancel: (info: BetInfo) => {
                this.resetCurrentBetInput(info.choice);
                this.setBetButtonFrame(false, info.choice);
            }
        };

        this.betBoardContainer && this.betBoardContainer.addChild(betBoardNode);
        this.betBoard.node.active = false;
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
}
