const { ccclass, property } = cc._decorator;
import ChanLe from './../ChanLe';
import BetBoard from './../bet-board/ChanLeBetBoard';
import * as DiaNan from './../../../tai-xiu/view-models/main-page/TXDiaNan';
import { getOnlyNumberInString, numberWithCommas, numberPad } from '../../../../common/helpers/Helper';
import * as Constants from './../../../tai-xiu/view-models/main-page/TXConstants';
import ProcessingWarning from './../../../../common/processing-warning/view-models/ProcessingWarning';
import * as ScaleEffect from './../../../tai-xiu/view-models/main-page/TXScale';
import * as DotLogs from './../../../tai-xiu/view-models/main-page/TXLogTips';
import AnimatedTime from './../../../../common/animated-time/view-models/AnimatedTime';

@ccclass
export default class ChanLeMain extends cc.Component {
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
    public dice: cc.Sprite[] = [];

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
    public dotYellow: cc.SpriteFrame = null;

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

    private betChoice = {
        left: "left",
        right: "right"
    }

    private root: ChanLe;
    private isNan = false;
    private waitingBetResponse = false;
    private touchOffset: cc.Vec2 = null;
    private processingWarning: ProcessingWarning;

    private currentInputBet: cc.Label;
    private currentInputSide: string;
    private currentTimeRemain: number;
    private currentResultData: any;
    private currentResultDices: number[];
    private currentPlayTimeInteval: number;
    private currentDotLogs: DotLogs[] = [];
    private isUM = false;

    init(root: ChanLe) {
        this.root = root;

        Promise.all(
            this.dotLogs.children.map(function (dot) {
                return dot.getComponent("TXLogTips");
            })
        ).then(result => {
            this.currentDotLogs = result;
        });
    }

    onLoad() {
        this.betBoard.init(this);
        this.diaNan.init(this);
        this.diceAnimation.on("finished", this.onDiceAnimationFinished, this);
        this.centerRoundLight.runAction(
            cc.repeatForever(cc.rotateBy(1.1, 360))
        );
    }

    onEnable() {
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    }

    onData(data: any) {
        if (data.um) {
            if (this.currentTimeRemain == Constants.betTime || data.time_remain == Constants.fullTime) {
                this.isUM = true;
                this.noticeUM.active = true;
                this.onGameHide();

                return;
            }
        }

        if (data.apiError) {
            this.closeProcessingWarningPopup();
        }

        if (data.err) {
            this.closeProcessingWarningPopup();
            this.showMiniWarningMessage(data.err);
        }

        if (data.chanle && !this.isUM) {
            this.onDataChanLe(data.chanle);
        }

        if (data.logs && !this.isUM) {
            this.onDataLogs(data);
        }

        if (data.status) {
            this.onDataStatus(data.status);
        }

        if (data.time_remain) {
            this.isUM = false;
            this.centerRoundLight.runAction(
                cc.repeatForever(cc.rotateBy(1.1, 360))
            );
            this.noticeUM.active = false;
            this.currentTimeRemain = data.time_remain;
            this.playTime();
        }

        if (data.finish) {
            this.onDataFinishPhien(data);
        }
    }

    onDataChanLe(data) {
        void 0 !== data.red_chan && (this.totalBetLeft.string = numberWithCommas(data.red_chan));
        void 0 !== data.red_le && (this.totalBetRight.string = numberWithCommas(data.red_le));
        void 0 !== data.red_me_chan && (this.userBetLeft.string = numberWithCommas(data.red_me_chan));
        void 0 !== data.red_me_le && (this.userBetRight.string = numberWithCommas(data.red_me_le));
        void 0 !== data.red_player_chan && (this.playersLeft.string = numberWithCommas(data.red_player_chan));
        void 0 !== data.red_player_le && (this.playersRight.string = numberWithCommas(data.red_player_le));
    }

    onDataLogs(data) {
        this.currentResultData = data.logs;
        this.currentResultDices = [...data.logs[0].dice];

        if (this.currentTimeRemain > Constants.betTime) {
            this.setDice(true);
            this.showResult();
        }

        this.dataLogs(this.currentResultData);
    }

    dataLogs(resultData: any) {
        var self = this;

        if (resultData && resultData.length) {
            Promise.all(
                self.currentDotLogs.map(function (dot, index) {
                    var data = resultData[index];

                    if (data) {
                        var point = data.dice[0] + data.dice[1] + data.dice[2];
                        dot.node.active = true;
                        dot.text.string =
                            data.dice[0] + "-" + data.dice[1] + "-" + data.dice[2];
                        dot.sprite.spriteFrame = point % 2
                            ? self.dotBlack
                            : self.dotYellow;
                    } else {
                        dot.node.active = false;
                    }
                })
            );
        }
    }

    onDataStatus(data) {
        var self = this;

        setTimeout(
            function () {
                if (!self.isNan) {
                    self.showBetWinLoss(data);
                }
                self.root.sendData({ get_new: true });
            }.bind(this),
            2e3
        );
    }

    onDataFinishPhien(data) {
        void 0 !== this.currentPlayTimeInteval && clearInterval(this.currentPlayTimeInteval);

        this.currentResultData.unshift({
            dice: [
                data.finish.dices[0],
                data.finish.dices[1],
                data.finish.dices[2]
            ],
            phien: data.finish.phien
        });

        this.currentResultData.length > 120 && this.currentResultData.pop();
        this.dataLogs(this.currentResultData);
        this.currentResultDices = [...data.finish.dices];
        this.setResultNumber();

        if (this.isNan) {
            this.diaNan.active = true;
            this.diaNan.position = cc.v2(0, -11.5);
            this.diaNanSprite.node.active = false;
            this.onDiceAnimationFinished();
        } else {
            this.diceAnimation.node.active = true;
            if (this.node.activeInHierarchy && cc.RedT.GAME_IS_SHOWED) {
                this.diceAnimation.play();
            } else {
                this.onDiceAnimationFinished();
            }
        }

        this.timeWaitNode.active = true;
        this.animatedTime.node.active = false;
        this.currentTimeRemain = Constants.betTime + Constants.waitTime;
        this.playTime();
    }

    eventStart(event) {
        this.touchOffset = cc.v2(
            event.touch.getLocationX() - this.node.position.x,
            event.touch.getLocationY() - this.node.position.y
        );
    }
    eventMove(event) {
        this.node.position = cc.v2(
            event.touch.getLocationX() - this.touchOffset.x,
            event.touch.getLocationY() - this.touchOffset.y
        );
    }
    eventEnd() {
        //cc.RedT.setting.taixiu.position = this.node.position;
    }

    onGameHide() {
        this.currentPlayTimeInteval && clearInterval(this.currentPlayTimeInteval);
        this.resetUI();
        this.centerRoundLight.stopAllActions();
    }

    onBetClick() {
        var bet = getOnlyNumberInString(this.currentInputBet.string);
        bet = parseInt(bet);
        this.currentInputBet.string = "ĐẶT CƯỢC";
        this.betBoard.node.active = false;
        this.setBetButtonClicked(false);

        if (isNaN(bet) || bet < Constants.minBet) {
            this.showMiniWarningMessage(
                "Tiền cược tối thiểu là " + Constants.minBet
            );
        } else if (bet > Constants.maxBet) {
            this.showMiniWarningMessage(
                "Tiền cược tối đa là " + Constants.maxBet
            );
        } else {
            if (this.waitingBetResponse) {
                var processingWarningNode = cc.instantiate(this.processingWarningPrefab);
                this.processingWarning = processingWarningNode.getComponent("ProcessingWarning");
                this.notice.addChild(processingWarningNode);
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
        this.diaNanSprite.spriteFrame = this.isNan ? this.diaNanSpriteFrames[1] : this.diaNanSpriteFrames[0];
    }

    onSelectBetInput(event, select) {
        if (this.betBoard.node.active) {
            return;
        }

        this.setBetButtonClicked(true, select);
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

        console.log(this.currentInputBet);
    }

    onChangeBetInput() {
        var value = numberWithCommas(
            getOnlyNumberInString(this.currentInputBet.string)
        );

        this.currentInputBet.string = value == "0" ? "" : value;
    }

    setPhienLabel(turnId) {
        if (turnId) {
            this.phienLabel.string = "";
            return;
        }

        this.phienLabel.string = "#" + turnId;
    }

    setDice(bool = false, sprite = true) {
        var self = this;
        Promise.all(
            this.dice.map(function (dice, index) {
                sprite && (dice.spriteFrame = self.diceFrames[self.currentResultDices[index] - 1]);
                dice.node.active = bool;
            })
        );
    }

    setCurrentBetInput(value) {
        var betValue = getOnlyNumberInString(this.currentInputBet.string) * 1 + value * 1;

        this.currentInputBet.string = numberWithCommas(betValue);
        this.currentInputBet.node.active = true;
    }

    playTime() {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        void 0 !== this.currentPlayTimeInteval && clearInterval(this.currentPlayTimeInteval);
        var self = this;

        this.currentPlayTimeInteval = setInterval(
            function () {
                if (self.currentTimeRemain > Constants.betTime) {
                    var time = numberPad(
                        self.currentTimeRemain - Constants.betTime - 1,
                        2
                    );

                    self.showWaitTime(time);

                    if (self.currentResultDices.length > 0) {
                        self.setResultNumber();

                        if (self.isNan) {
                            if (self.currentTimeRemain < Constants.nanTime) {
                                self.setDice(true);
                                self.showResult();
                                self.diaNan.active = false;
                            }
                        }
                    }
                    if (self.currentResultData) {
                        self.setPhienLabel(self.currentResultData[0].phien);
                    }
                } else {
                    self.resetUI();
                    self.currentResultDices = [];

                    if (self.currentResultData) {
                        self.setPhienLabel(self.currentResultData[0].phien + 1);
                    }

                    if (self.currentTimeRemain === Constants.betTime) {
                        self.resetData();
                    }

                    if (self.currentTimeRemain > Constants.minBetTime) {
                        var time = numberPad(
                            self.currentTimeRemain - 1,
                            2
                        );
                        self.animatedTime.setTime(time);
                        self.diaNanSprite.node.active = self.animatedTime.node.active = !self.isUM;
                    } else clearInterval(self.currentPlayTimeInteval);
                }

                self.currentTimeRemain--;
            }.bind(this),
            1000
        );
    }

    private setResultNumber() {
        var diemSo = this.currentResultDices[0] + this.currentResultDices[1] + this.currentResultDices[2];
        this.resultLabel.string = diemSo.toString();
    }

    showWaitTime(time) {
        this.timeWaitNode.active = true;
        this.timeWaitLabel.string = "00:" + numberPad(time, 2);
    }

    resetUI() {
        this.stopWinningAnims();
        this.animatedTime.node.active = false;
        this.diceAnimation.node.active = false;
        this.timeWaitNode.active = this.resultNode.active = this.diaNan.active = false;
        this.setDice(false, false);
    }
    resetData() {
        this.isNan && this.dataLogs(this.currentResultData);
        this.totalBetLeft.string
            = this.totalBetLeft.string
            = this.userBetLeft.string
            = this.userBetRight.string
            = this.playersLeft.string
            = this.playersRight.string = '0';
    }

    private closeProcessingWarningPopup() {
        this.waitingBetResponse = false;

        if (this.processingWarning) {
            this.processingWarning.close();
        }
    }

    private onDiceAnimationFinished() {
        console.log("here")
        this.setDice(true);
        this.showResult();
        this.diceAnimation.node.active = false;
    }


    showResult() {
        var resultNumber = this.currentResultDices[0] + this.currentResultDices[1] + this.currentResultDices[2];
        this.resultLabel.string = resultNumber.toString();
        this.resultNode.active = true;
        this.stopWinningAnims();

        if (resultNumber % 2) {
            this.rightWinningEffect.play();
            this.rightWinningAnimation.node.active = true;
            this.rightWinningAnimation.play();
        } else {
            this.leftWinningEffect.play();
            this.leftWinningAnimation.node.active = true;
            this.leftWinningAnimation.play();
        }
    }

    private stopWinningAnims() {
        this.leftWinningEffect.stop();
        this.rightWinningEffect.stop();
        this.leftWinningAnimation.node.active = false;
        this.leftWinningAnimation.stop();
        this.rightWinningAnimation.node.active = false;
        this.rightWinningAnimation.stop();
    }

    private showBetWinLoss(data) {
        if (!cc.RedT.GAME_IS_SHOWED || !this.notice) {
            return;
        }

        var temp = new cc.Label();
        temp.addComponent(cc.Label);
        temp = temp.getComponent(cc.Label);
        temp.string = (data.win ? "+" : "-") + numberWithCommas(data.bet);
        temp.font = data.win ? this.fontPlus : this.fontMinus;
        temp.lineHeight = 130;
        temp.fontSize = 22;
        temp.node.position = cc.v2(data.select ? -252 : 252, -50);
        this.notice.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(3, cc.v2(data.select ? -252 : 252, 130)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
        // if (void 0 !== data.thuong && data.thuong > 0) {
        //     var thuong = new cc.Node();
        //     thuong.addComponent(cc.Label);
        //     thuong = thuong.getComponent(cc.Label);
        //     thuong.string =
        //         (data.win ? "+" : "-") + helper.numberWithCommas(data.thuong);
        //     thuong.font = cc.RedT.util.fontEffect;
        //     thuong.lineHeight = 90;
        //     thuong.fontSize = 14;
        //     this.notice.addChild(thuong.node);
        //     thuong.node.runAction(
        //         cc.sequence(
        //             cc.moveTo(3, cc.v2(0, 100)),
        //             cc.callFunc(function () {
        //                 this.node.destroy();
        //             }, thuong)
        //         )
        //     );
        // }
    }

    private setBetButtonClicked(isClick, select = '') {
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

    private showMiniWarningMessage(message) {
        var miniWarningPrefab = cc.instantiate(this.miniWarningPrefab);
        var miniWarning = miniWarningPrefab.getComponent("mini_warning");
        miniWarning.text.string = message;
        this.notice.addChild(miniWarningPrefab);
    }
}
