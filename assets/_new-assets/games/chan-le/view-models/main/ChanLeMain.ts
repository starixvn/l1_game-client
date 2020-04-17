const { ccclass, property } = cc._decorator;
import ChanLe from './../ChanLe';
import BetBoard from './../bet-board/ChanLeBetBoard';
import DiaNan from './ChanLeDiaNan';
import { getOnlyNumberInString, numberWithCommas, numberPad } from '../../../../common/helpers/Helper';
import ProcessingWarning from './../../../../common/processing-warning/view-models/ProcessingWarning';
import * as ScaleEffect from './../../../tai-xiu/view-models/main-page/TXScale';
import AnimatedTime from './../../../../common/animated-time/view-models/AnimatedTime';
import ChanLeLogTips from './ChanLeLogTips';

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

    @property(BetBoard)
    public betBoard: BetBoard = null;

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

    @property({ type: cc.Node })
    public noticeUM: cc.Node = null;

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

    //#endregion
    public isNan = false;

    private static readonly DAT_CUOC = "ĐẶT CƯỢC";

    private betChoice = {
        left: "left",
        right: "right"
    }

    private root: ChanLe;
    private waitingBetResponse = false;
    private processingWarning: ProcessingWarning;
    private currentInputBet: cc.Label;
    private currentInputSide: string;
    private currentTimeRemain: number;
    private currentDataLogs: any;
    private currentResultDices: number[];
    private currentPlayTimeInteval: number;
    private currentDotLogs: ChanLeLogTips[] = [];
    private isUM = false;

    init(root: ChanLe) {
        this.root = root;
        this.betBoard.init(this);
        this.diaNan.init(this);
    }

    onLoad() {
        this.diceAnimation.on("finished", this.onDiceAnimationFinished, this);
        this.playCenterLight();
        this.initDotLogs();
    }

    onGameHide() {
        this.currentPlayTimeInteval && clearInterval(this.currentPlayTimeInteval);
        this.resetUI();
        this.resetData();
        this.centerRoundLight.stopAllActions();
    }

    onData(data: any) {
        this.handleDataUM(data);
        this.handleDataError(data);
        this.handleDataGame(data);
        this.handleDataLogs(data);
        this.handleDataBetStatus(data);
        this.handleDataTime(data);
        this.handleDataFinishTurn(data);
    }

    handleDataUM(data: any): boolean {
        if (!data.um) {
            return;
        }

        if (this.currentTimeRemain == this.root.gameConfigs.betTime
            || data.time_remain == this.root.gameConfigs.fullTime) {
            this.isUM = true;
            this.noticeUM.active = true;
            this.onGameHide();
        }
    }

    handleDataError(data: any) {
        if (data.apiError) {
            this.closeProcessWarning();
        }

        if (data.err) {
            this.closeProcessWarning();
            this.showMiniWarning(data.err);
        }
    }

    handleDataGame(data: any) {
        if (!data[this.root.gameName] || this.isUM) {
            return;
        }

        var chanleData = data[this.root.gameName];

        if (chanleData.red_me_chan || chanleData.red_me_le) {
            this.closeProcessWarning();
        }

        chanleData.red_chan && (this.totalBetLeft.string = numberWithCommas(chanleData.red_chan));
        chanleData.red_le && (this.totalBetRight.string = numberWithCommas(chanleData.red_le));
        chanleData.red_me_chan && (this.userBetLeft.string = numberWithCommas(chanleData.red_me_chan));
        chanleData.red_me_le && (this.userBetRight.string = numberWithCommas(chanleData.red_me_le));
        chanleData.red_player_chan && (this.playersLeft.string = numberWithCommas(chanleData.red_player_chan));
        chanleData.red_player_le && (this.playersRight.string = numberWithCommas(chanleData.red_player_le));
    }

    handleDataLogs(data) {
        if (!data.logs) {
            return;
        }

        this.currentDataLogs = data.logs;
        this.currentResultDices = [...data.logs[0].dice];

        if (this.currentTimeRemain > this.root.gameConfigs.betTime && !this.isUM) {
            this.showDices(true);
            this.showBetResult();
        }

        this.buildDotLogs(this.currentDataLogs);

        if (this.root.statistics) {
            this.root.statistics.drawStatistics();
        }
    }

    handleDataTime(data: any) {
        if (data.time_remain) {
            this.isUM = false;
            this.playCenterLight();
            this.noticeUM.active = false;
            this.currentTimeRemain = data.time_remain;
            this.playTime();
        }
    }

    handleDataBetStatus(data) {
        if (!data.status) {
            return;
        }

        var self = this;

        setTimeout(() => {
            if (!self.isNan) {
                self.showUserWinLossAnimation(data.status);
            }
            self.root.sendData({ get_new: true });
        }, 2e3);
    }

    handleDataFinishTurn(data) {
        if (!data.finish) {
            return;
        }

        this.currentPlayTimeInteval && clearInterval(this.currentPlayTimeInteval);
        this.currentDataLogs.unshift({
            dice: [
                data.finish.dices[0],
                data.finish.dices[1],
                data.finish.dices[2]
            ],
            phien: data.finish.phien
        });

        this.currentDataLogs.length > 120 && this.currentDataLogs.pop();
        this.buildDotLogs(this.currentDataLogs);
        this.currentResultDices = [...data.finish.dices];

        if (this.isNan) {
            this.diaNan.node.active = true;
            this.diaNan.node.position = cc.v2(0, -11.5);
            this.diaNanSprite.node.active = false;
            this.onDiceAnimationFinished();
        } else {
            this.diceAnimation.node.active = true;
            this.diceAnimation.play();
        }

        this.timeWaitNode.active = true;
        this.animatedTime.node.active = false;
        this.currentTimeRemain = this.root.gameConfigs.betTime + this.root.gameConfigs.waitTime;
        this.playTime();
    }

    onBetClick() {
        var bet = getOnlyNumberInString(this.currentInputBet.string);
        bet = parseInt(bet);
        this.resetCurrentBetInput();
        this.betBoard.node.active = false;
        this.setBetButtonFrame(false);

        if (isNaN(bet) || bet < this.root.gameConfigs.minBet) {
            this.showMiniWarning(
                "Tiền cược tối thiểu là " + this.root.gameConfigs.minBet
            );
        } else if (bet > this.root.gameConfigs.maxBet) {
            this.showMiniWarning(
                "Tiền cược tối đa là " + this.root.gameConfigs.maxBet
            );
        } else {
            if (this.waitingBetResponse) {
                this.showBetProcessWarning();
                return;
            }

            this.waitingBetResponse = true;
            this.root.sendData({
                cuoc: {
                    red: true,
                    select: this.currentInputSide == this.betChoice.left,
                    bet: bet
                }
            })
        }
    }

    onDiaNanClick() {
        this.isNan = !this.isNan;
        this.diaNanSprite.spriteFrame
            = this.isNan ? this.diaNanSpriteFrames[1] : this.diaNanSpriteFrames[0];
    }

    onSelectBetInput(event, select: string) {
        if (this.betBoard.node.active) {
            return;
        }

        this.setBetButtonFrame(true, select);
        this.betBoard.node.active = true;
        this.currentInputSide = select;

        switch (select) {
            case this.betChoice.right:
                this.currentInputBet = this.betInputRight;
                break;

            case this.betChoice.left:
                this.currentInputBet = this.betInputLeft;
                break;

        }
    }

    setCurrentBetInput(value: number): void {
        var betValue = getOnlyNumberInString(this.currentInputBet.string) * 1 + value * 1;

        this.currentInputBet.string = numberWithCommas(betValue);
        this.currentInputBet.node.active = true;
    }

    resetCurrentBetInput(): void {
        this.currentInputBet.string = ChanLeMain.DAT_CUOC;
        this.currentInputBet.node.active = true;
    }

    setBetButtonFrame(isClick: boolean, select = '') {
        if (isClick) {
            if (select == this.betChoice.right) {
                this.betButtonSpriteRight.spriteFrame = this.betButtonClickedImage;
            }
            else {
                this.betButtonSpriteLeft.spriteFrame = this.betButtonClickedImage;
            }
        }
        else {
            this.betButtonSpriteRight.spriteFrame = this.betButtonUnClickedImage;
            this.betButtonSpriteLeft.spriteFrame = this.betButtonUnClickedImage;
        }
    }

    getCurrentDataLogs = () => this.currentDataLogs;

    private initDotLogs() {
        Promise.all(this.dotLogs.children.map((dot) => {
            return dot.getComponent("ChanLeLogTips") as ChanLeLogTips;
        })).then(result => {
            this.currentDotLogs = result;
        });
    }

    private buildDotLogs(dataLogs: any) {
        if (!dataLogs || !dataLogs.length) {
            return;
        }

        var self = this;
        Promise.all(self.currentDotLogs.map(function (dotLog, index) {
            var data = dataLogs[index];

            if (data) {
                var point = data.dice[0] + data.dice[1] + data.dice[2];
                dotLog.node.active = true;
                dotLog.text.string =
                    data.dice[0] + "-" + data.dice[1] + "-" + data.dice[2];
                dotLog.turnId = data.phien;
                dotLog.sprite.spriteFrame = point % 2
                    ? self.dotBlack
                    : self.dotWhite;
            } else {
                dotLog.node.active = false;
            }
        }));
    }

    private playTime() {
        this.currentPlayTimeInteval && clearInterval(this.currentPlayTimeInteval);
        var self = this;

        this.currentPlayTimeInteval = setInterval(() => {
            const isInWaitTime = self.currentTimeRemain > this.root.gameConfigs.betTime;

            if (isInWaitTime) {
                var time = numberPad(self.currentTimeRemain - this.root.gameConfigs.betTime - 1, 2);
                self.showWaitTime(time);

                if (self.isNan) {
                    if (self.currentTimeRemain < this.root.gameConfigs.nanTime) {
                        self.showDices(true);
                        self.showBetResult();
                        self.diaNan.node.active = false;
                    }
                }

                if (self.currentDataLogs) {
                    self.setTurnLabel(self.currentDataLogs[0].phien);
                }
            } else {
                self.resetUI();
                self.currentResultDices = [];
                const isStartingNewTurn = self.currentTimeRemain == this.root.gameConfigs.betTime;
                const isInTurnTime = self.currentTimeRemain > this.root.gameConfigs.minBetTime;

                if (self.currentDataLogs) {
                    self.setTurnLabel(self.currentDataLogs[0].phien + 1);
                }

                if (isStartingNewTurn) {
                    self.resetData();
                }

                if (isInTurnTime) {
                    var time = numberPad(self.currentTimeRemain - 1, 2);
                    self.animatedTime.setTime(time);
                    self.diaNanSprite.node.active = self.animatedTime.node.active = true;
                } else {
                    clearInterval(self.currentPlayTimeInteval);
                }
            }
            self.currentTimeRemain--;
        }, 1000);
    }

    private showWaitTime(time) {
        this.timeWaitNode.active = true;
        this.timeWaitLabel.string = "00:" + numberPad(time, 2);
    }

    private setTurnLabel(turnId) {
        if (turnId) {
            this.phienLabel.string = "#" + turnId;
        }
    }

    private onDiceAnimationFinished() {
        this.showDices(true);
        !this.isNan && this.showBetResult();
        this.diceAnimation.node.active = false;
    }

    private showDices(showDice = false, showDiceSprite = true) {
        var self = this;
        Promise.all(this.dices.map((dice, index) => {
            showDiceSprite && (dice.spriteFrame = self.diceFrames[self.currentResultDices[index] - 1]);
            dice.node.active = showDice;
        }));
    }

    private showBetResult() {
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

    private showResultPoint(): number {
        var point = this.currentResultDices[0] + this.currentResultDices[1] + this.currentResultDices[2];
        this.resultLabel.string = point.toString();
        this.resultNode.active = true;

        return point;
    }

    private stopWinningAnims() {
        this.leftWinningEffect.stop();
        this.rightWinningEffect.stop();
        this.leftWinningAnimation.node.active = false;
        this.leftWinningAnimation.stop();
        this.rightWinningAnimation.node.active = false;
        this.rightWinningAnimation.stop();
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
                cc.moveTo(3, cc.v2(data.select ? -245 : 245, 130)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, resultLabel)
            )
        );
    }

    private showMiniWarning(message) {
        var miniWarningPrefab = cc.instantiate(this.miniWarningPrefab);
        var miniWarning = miniWarningPrefab.getComponent("mini_warning");
        miniWarning.text.string = message;
        this.notice.addChild(miniWarningPrefab);
    }

    private showBetProcessWarning() {
        var processingWarningNode = cc.instantiate(this.processingWarningPrefab);
        this.processingWarning = processingWarningNode.getComponent("ProcessingWarning");
        this.notice.addChild(processingWarningNode);
    }

    private closeProcessWarning() {
        this.waitingBetResponse = false;

        if (this.processingWarning) {
            this.processingWarning.close();
        }
    }

    private playCenterLight() {
        this.centerRoundLight.runAction(cc.repeatForever(cc.rotateBy(1.1, 360)));
    }

    private resetUI() {
        this.stopWinningAnims();
        this.animatedTime.node.active = false;
        this.diceAnimation.node.active = false;
        this.timeWaitNode.active = this.resultNode.active = this.diaNan.node.active = false;
        this.showDices(false, false);
    }

    private resetData() {
        this.totalBetLeft.string
            = this.totalBetRight.string
            = this.userBetLeft.string
            = this.userBetRight.string
            = this.playersLeft.string
            = this.playersRight.string = '0';
    }
}
