import { getOnlyNumberInString, numberPad, numberTo, numberWithCommas } from "../../../../common/helpers/NumberHelper";
import UmWarning from "../../../../common/um-warning/UmWarning";

const BrowserUtil = require("BrowserUtil"),
    TXScale = require("TXScale"),
    Constants = require("TXConstants"),
    NoticeUtil = require("NoticeUtil");

cc.Class({
    extends: cc.Component,
    properties: {
        background: {
            default: null,
            type: cc.Node
        },
        inputL: cc.Sprite,
        inputR: cc.Sprite,
        inputLTxt: cc.Label,
        inputRTxt: cc.Label,
        totalLeft: {
            default: null,
            type: cc.Label
        },
        totalRight: {
            default: null,
            type: cc.Label
        },
        myLeft: {
            default: null,
            type: cc.Label
        },
        myRight: {
            default: null,
            type: cc.Label
        },
        playerLeft: {
            default: null,
            type: cc.Label
        },
        playerRight: {
            default: null,
            type: cc.Label
        },
        nodeKetQua: {
            default: null,
            type: cc.Node
        },
        labelKetQua: {
            default: null,
            type: cc.Label
        },
        timeWait: {
            default: null,
            type: cc.Label
        },
        nodeTimeWait: {
            default: null,
            type: cc.Node
        },
        timeCuoc: {
            default: null,
            type: cc.Label
        },
        timePopup: {
            default: null,
            type: cc.Label
        },
        nodeChanLe: {
            default: null,
            type: cc.Node
        },
        nodeTaiXiu: {
            default: null,
            type: cc.Node
        },
        nodeTimePopup: {
            default: null,
            type: cc.Node
        },
        labelPhien: {
            default: null,
            type: cc.Label
        },
        diaNan: {
            default: null,
            type: cc.Node
        },
        dice: {
            default: [],
            type: cc.Sprite
        },
        diceSF: {
            default: [],
            type: cc.SpriteFrame
        },
        dotLogs: {
            default: null,
            type: cc.Node
        },
        diceAnimation: {
            default: null,
            type: cc.Animation
        },
        efTai: TXScale,
        efXiu: TXScale,
        efChan: TXScale,
        efLe: TXScale,
        winningTai: {
            default: null,
            type: cc.Animation
        },
        winningXiu: {
            default: null,
            type: cc.Animation
        },
        frameNan: {
            default: [],
            type: cc.SpriteFrame
        },
        spriteNan: {
            default: null,
            type: cc.Sprite
        },
        dot_black: {
            default: null,
            type: cc.SpriteFrame
        },
        dot_white: {
            default: null,
            type: cc.SpriteFrame
        },
        dot_yellow: {
            default: null,
            type: cc.SpriteFrame
        },
        notice: {
            default: null,
            type: cc.Node
        },
        mini_warning: {
            default: null,
            type: cc.Prefab
        },
        WIN_HT: {
            default: null,
            type: cc.Label
        },
        WIN_DN: {
            default: null,
            type: cc.Label
        },
        LOST_HT: {
            default: null,
            type: cc.Label
        },
        LOST_DN: {
            default: null,
            type: cc.Label
        },
        red: true,
        taixiu: true,
        centerRoundLight: {
            default: null,
            type: cc.Sprite
        },
        AnimatedTime: cc.Component,
        BetButtonClickedFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        BetButtonUnClickedFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        UMWarning: UmWarning,
        ProcessingWarning: {
            default: null,
            type: cc.Prefab
        },
        extendTouchPart: {
            default: null,
            type: cc.Component
        },
        gameAudiosPrefab: {
            default: null,
            type: cc.Prefab
        },
        balanceBetNoticePrefab: {
            default: null,
            type: cc.Prefab
        },
        balanceBetNoticeContainer: cc.Node,
        historyButton: {
            default: null,
            type: cc.Node
        },
        betBoardContainer: {
            default: null,
            type: cc.Node
        },
        betBoardPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    init: function (obj) {
        this.TXRoot = obj;
        cc.RedT.setting.taixiu.data = cc.RedT.setting.taixiu.data || {
            taixiu: {},
            chanle: {},
            du_day: {}
        };

        this.isNan = false;
        this.localResultDices = [];
        this.gameAudios = null;
        this.redTai = 0;
        this.redXiu = 0;
        this.balanceBetNotice = null;
        this.currentStatus = null;
        this.presetBetValue = 0;
        this.MAX_BET = 20000;
        this.betBoard = null;

        if (void 0 === cc.RedT.setting.taixiu.red) {
            cc.RedT.setting.taixiu.red = this.red;
        }
        if (void 0 === cc.RedT.setting.taixiu.taixiu) {
            cc.RedT.setting.taixiu.taixiu = this.taixiu;
        }
        if (void 0 === cc.RedT.setting.taixiu.getLogs) {
            cc.RedT.setting.taixiu.getLogs = false;
        }
        if (void 0 === cc.RedT.setting.taixiu.isNan) {
            cc.RedT.setting.taixiu.isNan = false;
        }

        Promise.all(
            this.dotLogs.children.map(function (dot) {
                var temp = dot.getComponent(cc.Sprite);
                temp.mod = dot.getComponent("TXLogTips");
                return temp;
            })
        ).then((resulf) => {
            this.dotLogs = resulf;
        });

        this.onDiceAnimationFinish = function (event) {
            this.setDice(true);
            this.dataLogs();
            !this.isNan && this.showResult();
            this.diceAnimation.node.active = false;
        };

        if (cc.RedT.setting.taixiu.getLogs) {
            if (void 0 !== cc.RedT.setting.taixiu.position) {
                this.node.position = cc.RedT.setting.taixiu.position;
            }
            if (void 0 !== cc.RedT.setting.taixiu.time_remain) {
                cc.RedT.setting.taixiu.time_remain++;
            }
            this.reLoadGame();
        }

        this.resetBetButtonText();
    },

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
        this.AnimatedTime.node.active = false;
        this.waitingBetResponse = false;
        let self = this;
        this.ttOffset = null;
        this.initBetBoard();

        this.diaNan.getComponent("TXDiaNan").init(this);

        this.playCenterRoundLight();

        this.keyHandle = function (t) {
            if (t.keyCode === cc.macro.KEY.tab) {
                self.changeNextFocusEditBox();
                if (t.preventDefault && t.preventDefault()) {
                    return false;
                }
                return undefined;
            } else if (t.keyCode === cc.macro.KEY.enter) {
                BrowserUtil.focusGame();
                self.onCuocClick();
                if (t.preventDefault && t.preventDefault()) {
                    return false;
                }

                return undefined;
            }
            return undefined;
        };

        this.diceAnimation.on("finished", this.onDiceAnimationFinish, this);

        if (this.TXRoot.board) {
            this.inputL.active = this.inputR.active = false;
        }

        var extendTouchPartComponent = this.extendTouchPart.getComponent("ExtendTouchPart");
        if (extendTouchPartComponent) {
            extendTouchPartComponent.listener = {
                eventStart: (e) => this.eventStart(e),
                eventMove: (e) => this.eventMove(e),
                eventEnd: () => this.eventEnd()
            };
        }

        this.initGameAudios();
    },
    initGameAudios: function () {
        var gameAudiosNode = cc.instantiate(this.gameAudiosPrefab);
        this.gameAudios = gameAudiosNode.getComponent("GameAudios");
    },
    onEnable: function () {
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        this.TXRoot.board && cc.sys.isBrowser && this.addEvent();
    },
    onDisable: function () {
        this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);

        this.TXRoot.board && cc.sys.isBrowser && this.removeEvent();
    },
    addEvent: function () {
        for (const t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1);
        }
    },
    removeEvent: function () {
        for (const t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1);
        }
    },
    changeNextFocusEditBox: function () {
        let t = false;
        for (var e = 0, i = this.editboxs.length; e < i; e++) {
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = true;
                break;
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[1]);
    },
    initGame: function (taixiu) {
        if (taixiu !== this.taixiu) {
            this.onChangerGame();
        }
    },
    onChangerGame: function () {
        cc.RedT.setting.taixiu.taixiu = this.taixiu = !this.taixiu;
        this.nodeTaiXiu.active = this.taixiu;
        this.nodeChanLe.active = !this.taixiu;
        if (cc.RedT.setting.taixiu.getLogs) {
            this.dataLogs();
            self.TXRoot.TXStats.onChangerGame();
            this.TXRoot.TX_LichSuPhien.onChangerGame();
            this.taixiu && this.onDataTaiXiu(cc.RedT.setting.taixiu.data.taixiu);
            this.onDuDay(cc.RedT.setting.taixiu.data.du_day);
        }
    },
    onChangerNan: function () {
        cc.RedT.setting.taixiu.isNan = this.isNan = !this.isNan;
        this.spriteNan.spriteFrame = this.isNan ? this.frameNan[1] : this.frameNan[0];
    },
    reLoadGame: function () {
        setTimeout(
            function () {
                if (cc.RedT.setting.taixiu.red !== this.red) {
                    this.onChangerRED();
                }
                if (cc.RedT.setting.taixiu.taixiu !== this.taixiu) {
                    this.onChangerGame();
                } else {
                    this.dataLogs();
                }
                if (cc.RedT.setting.taixiu.isNan !== this.isNan) {
                    this.onChangerNan();
                }

                this.onDuDay(cc.RedT.setting.taixiu.data.du_day);

                if (cc.RedT.setting.taixiu.taixiu) {
                    this.onDataTaiXiu(cc.RedT.setting.taixiu.data.taixiu);
                }
            }.bind(this),
            50
        );
    },
    onChangerRED: function () {
        cc.RedT.setting.taixiu.red = this.red = !this.red;
        this.totalLeft.node.color = this.totalRight.node.color = this.red
            ? this.totalRight.node.color.fromHEX("#FFEB0A")
            : this.totalRight.node.color.fromHEX("#FFFFFF");
        //FIX ME: TX_LichSuPhien NOT FOUND
        this.TXRoot.TX_LichSuPhien.onChangerCoint();
        this.taixiu && this.onDataTaiXiu(cc.RedT.setting.taixiu.data.taixiu);
        this.onDuDay(cc.RedT.setting.taixiu.data.du_day);
    },
    eventStart: function (e) {
        this.setTop();
        this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    },
    eventMove: function (e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
    },
    eventEnd: function () {
        cc.RedT.setting.taixiu.position = this.node.position;
    },
    setTop: function () {
        this.node.parent.insertChild(this.node);
        this.TXRoot.setTop();
    },
    setBetButtonClicked(isClick, select) {
        if (!select) {
            this.inputR.spriteFrame = this.getBetButtonSpriteFrame(isClick);
            this.inputL.spriteFrame = this.getBetButtonSpriteFrame(isClick);
        } else {
            if (select === "right") {
                this.inputR.spriteFrame = this.getBetButtonSpriteFrame(isClick);
            }

            if (select === "left") {
                this.inputL.spriteFrame = this.getBetButtonSpriteFrame(isClick);
            }
        }
    },

    getBetButtonSpriteFrame: function (isClick) {
        return isClick ? this.BetButtonClickedFrame : this.BetButtonUnClickedFrame;
    },

    onSelectInput: function (event, select) {
        this.setBetButtonClicked(true, select);
        this.inputOld = select;
        this.input = select === "right" ? this.inputRTxt : this.inputLTxt;
        this.onChangerInput();
        const info = {
            choice: select,
            bet: 0,
            betItem: null,
            maxBet: this.MAX_BET
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
    },
    onChangerInput: function () {
        let value = numberWithCommas(getOnlyNumberInString(this.input.string));
        this.input.string = value;
    },
    setPhienLabel: function (phien) {
        if (phien === "") {
            this.labelPhien.string = "";
            return;
        }
        this.labelPhien.string = `#${phien}`;
    },
    setDice: function (bool = false, sprite = true) {
        let self = this;
        Promise.all(
            this.dice.map(function (dice, index) {
                if (sprite) {
                    dice.spriteFrame = self.diceSF[cc.RedT.setting.taixiu.logs[0].dice[index] - 1];
                }
                dice.node.active = bool;
            })
        );
    },
    onData: function (data) {
        if (data.um && (cc.RedT.setting.taixiu.time_remain === Constants.betTime || data.time_remain === Constants.fullTime)) {
            this.isUM = true;
            this.UMWarning.show(data);
            this.centerRoundLight.node.stopAllActions();
            this.onGameHide();

            return;
        }

        if (data.get_phien) {
            this.TXRoot.TXBetHistory.node && this.TXRoot.TXBetHistory.onData(data.get_phien);
        }

        this.onError(data);

        if (data.du_day) {
            Object.assign(cc.RedT.setting.taixiu.data.du_day, data.du_day);
            this.onDuDay(data.du_day);
        }
        if (data.taixiu && !this.isUM) {
            Object.assign(cc.RedT.setting.taixiu.data.taixiu, data.taixiu);
            this.taixiu && this.onDataTaiXiu(data.taixiu);
        }

        if (data.get_top) {
            this.TXRoot.TXTop.node && this.TXRoot.TXTop.onData(data.get_top);
        }
        if (data.status) {
            this.status(data.status);
        }
        if (data.get_log) {
            this.TXRoot.TXHistory.node && this.TXRoot.TXHistory.onData(data.get_log);
        }

        this.onDataLogs(data);

        if (data.time_remain) {
            this.isUM = false;
            this.playCenterRoundLight();
            this.UMWarning.node.active = false;
            cc.RedT.setting.taixiu.time_remain = +data.time_remain - 1;
            this.playTime();
        }

        this.onDataFinishPhien(data);
    },
    efStop: function () {
        this.efTai.stop();
        this.efXiu.stop();
        this.winningTai.node.active = false;
        this.winningTai.stop();
        this.winningXiu.node.active = false;
        this.winningXiu.stop();
    },
    onError: function (data) {
        if (data.apiError) {
            this.closeProcessingWarningPopup();
        }
        if (data.err) {
            this.closeProcessingWarningPopup();
            NoticeUtil.showNoticeMessage(this, data.err);
        }
    },
    onDataLogs: function (data) {
        if (void 0 !== data.logs) {
            cc.RedT.setting.taixiu.logs = data.logs;
            this.localResultDices = [...data.logs[0].dice];
            if (
                cc.RedT.setting.taixiu.time_remain > Constants.betTime &&
                cc.RedT.setting.taixiu.time_remain < Constants.displayResultTime
            ) {
                this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
                this.labelKetQua.string = this.diemSo;
                this.setDice(true);
                this.showResult();
            }
            this.dataLogs();
            cc.RedT.setting.taixiu.getLogs = true;
        }
    },
    onDataFinishPhien: function (data) {
        if (void 0 !== data.finish) {
            if (cc.RedT.setting.taixiu.getLogs) {
                // Huỷ đếm
                void 0 !== this.timeInterval && clearInterval(this.timeInterval);
                // Thêm kết quả
                cc.RedT.setting.taixiu.logs.unshift({
                    dice: [data.finish.dices[0], data.finish.dices[1], data.finish.dices[2]],
                    phien: data.finish.phien
                });
                cc.RedT.setting.taixiu.logs.length > 120 && cc.RedT.setting.taixiu.logs.pop();
                this.localResultDices = [...data.finish.dices];

                this.AnimatedTime.node.active = false;
            }
            cc.RedT.setting.taixiu.time_remain = Constants.betTime + Constants.waitTime;
            this.playTime();
        }
    },
    displayDiceResult: function () {
        this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
        this.labelKetQua.string = this.diemSo;

        if (this.isNan) {
            this.diaNan.active = true;
            this.diaNan.position = cc.v2(0, -11.5);
            this.spriteNan.node.active = false;
            this.onDiceAnimationFinish();
        } else {
            this.diceAnimation.node.active = true;
            if (this.node.activeInHierarchy && cc.RedT.GAME_IS_SHOWED) {
                this.diceAnimation.play();
            } else {
                this.onDiceAnimationFinish();
            }
        }
    },
    updateShowResult: function () {
        if (this.isNan) {
            if (cc.RedT.setting.taixiu.time_remain < Constants.nanTime) {
                this.setDice(true);
                this.showResult();
                this.diaNan.active = false;
            }
        }
    },
    playTime: function () {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        void 0 !== this.timeInterval && clearInterval(this.timeInterval);

        this.timeInterval = setInterval(
            function () {
                if (cc.RedT.setting.taixiu.time_remain > Constants.betTime) {
                    this.handleInWaitTime();
                } else {
                    this.handleInRoundTime();
                }
                cc.RedT.setting.taixiu.time_remain--;
            }.bind(this),
            1000
        );
    },

    handleInWaitTime: function () {
        const isBalanceBetTime = cc.RedT.setting.taixiu.time_remain > Constants.displayResultTime;
        if (isBalanceBetTime) {
            this.balanceBet(cc.RedT.setting.taixiu.time_remain === Constants.fullTime);
        } else {
            this.hideBetBalanceNotice();
            this.enableHistoryButton();
            if (cc.RedT.setting.taixiu.time_remain === Constants.displayResultTime) {
                this.displayDiceResult();
                this.showBetWinLoss();
            }
            // time count down to next phien
            var waitTime = numberPad(cc.RedT.setting.taixiu.time_remain - Constants.betTime - 1, 2);
            this.showWaitTime(waitTime);

            if (this.localResultDices.length > 0) {
                this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
                this.labelKetQua.string = this.diemSo;
                this.updateShowResult();
            }
            if (cc.RedT.setting.taixiu.logs) {
                this.setPhienLabel(cc.RedT.setting.taixiu.logs[0].phien);
            }
        }
    },

    handleInRoundTime: function () {
        this.resetUI();
        this.localResultDices = [];
        this.currentStatus = null;
        if (cc.RedT.setting.taixiu.logs) {
            this.setPhienLabel(cc.RedT.setting.taixiu.logs[0].phien + 1);
        }
        if (cc.RedT.setting.taixiu.time_remain === Constants.betTime) {
            this.reset();
        }

        if (cc.RedT.setting.taixiu.time_remain > Constants.minBetTime) {
            var time = numberPad(cc.RedT.setting.taixiu.time_remain - 1, 2);
            this.AnimatedTime.setTime(time);
            this.spriteNan.node.active = this.AnimatedTime.node.active = !this.isUM;
        } else {
            this.disableHistoryButton();
            clearInterval(this.timeInterval);
        }
    },

    showWaitTime: function (time) {
        if (this.nodeTimeWait) {
            this.nodeTimeWait.active = true;
        }
        this.timeWait.string = `00:${numberPad(time, 2)}`;
    },

    onDataTaiXiu: function (data) {
        if (void 0 !== cc.RedT.inGame.onGetTaiXiu) {
            cc.RedT.inGame.onGetTaiXiu(data.red_tai, data.red_xiu);
        }

        this.redTai = data.red_tai;
        this.redXiu = data.red_xiu;
        if (void 0 !== data.red_me_tai || void 0 !== data.red_me_xiu) {
            this.closeProcessingWarningPopup();
        }

        if (void 0 !== data.red_tai) {
            var sTai = getOnlyNumberInString(this.totalLeft.string);

            if (sTai < data.red_tai) {
                numberTo(this.totalLeft, sTai, data.red_tai, 0, true);
            } else {
                this.totalLeft.string = numberWithCommas(data.red_tai);
            }
        }
        if (void 0 !== data.red_xiu) {
            var sXiu = getOnlyNumberInString(this.totalRight.string);

            if (sXiu < data.red_xiu) {
                numberTo(this.totalRight, sXiu, data.red_xiu, 0, true);
            } else {
                this.totalRight.string = numberWithCommas(data.red_xiu);
            }
        }

        if (void 0 !== data.red_me_tai) {
            this.myLeft.string = numberWithCommas(data.red_me_tai);
        }
        if (void 0 !== data.red_me_xiu) {
            this.myRight.string = numberWithCommas(data.red_me_xiu);
        }
        if (void 0 !== data.red_player_tai) {
            const betTaiPercent = parseInt(data.red_player_tai) >> 0;
            this.playerLeft.string = `${betTaiPercent}%`;
        }
        if (void 0 !== data.red_player_xiu) {
            const betXiuPercent = parseInt(data.red_player_xiu) >> 0;
            this.playerRight.string = `${betXiuPercent}%`;
        }
    },
    onDuDay: function (data) {
        if (data) {
            if (this.taixiu) {
                if (this.red) {
                    this.WIN_HT.string = data.tLineWinRedH;
                    this.WIN_DN.string = data.tLineWinRed;
                    this.LOST_HT.string = data.tLineLostRedH;
                    this.LOST_DN.string = data.tLineLostRed;
                } else {
                    this.WIN_HT.string = data.tLineWinXuH;
                    this.WIN_DN.string = data.tLineWinXu;
                    this.LOST_HT.string = data.tLineLostXuH;
                    this.LOST_DN.string = data.tLineLostXu;
                }
            } else {
                if (this.red) {
                    this.WIN_HT.string = data.cLineWinRedH;
                    this.WIN_DN.string = data.cLineWinRed;
                    this.LOST_HT.string = data.cLineLostRedH;
                    this.LOST_DN.string = data.cLineLostRed;
                } else {
                    this.WIN_HT.string = data.cLineWinXuH;
                    this.WIN_DN.string = data.cLineWinXu;
                    this.LOST_HT.string = data.cLineLostXuH;
                    this.LOST_DN.string = data.cLineLostXu;
                }
            }
        }
    },
    dataLogs: function () {
        if (!!cc.RedT.setting.taixiu.logs.length) {
            let self = this;
            //Main log
            Promise.all(
                this.dotLogs.map(function (dot, index) {
                    var data = cc.RedT.setting.taixiu.logs[index];
                    if (void 0 !== data) {
                        var point = data.dice[0] + data.dice[1] + data.dice[2];
                        dot.node.active = true;
                        dot.node.phien = data.phien;
                        dot.mod.round.string = `#${data.phien}`;
                        dot.mod.text.string = `${point < 11 ? "XỈU" : "TÀI"} (${data.dice[0]}-${data.dice[1]}-${data.dice[2]})`;
                        dot.spriteFrame = point < 11 ? self.dot_white : self.dot_black;
                    } else {
                        dot.node.active = false;
                    }
                })
            );

            if (self.TXRoot.TXStats) {
                self.TXRoot.TXStats.updateTXStats(cc.RedT.setting.taixiu.logs);
            }
        }
    },

    resetUI: function () {
        this.efStop();
        this.AnimatedTime.node.active = false;
        this.diceAnimation.node.active = false;
        this.nodeTimeWait.active = this.nodeKetQua.active = this.diaNan.active = false;
        this.setDice(false, false);
        this.hideBetBalanceNotice();
        this.enableHistoryButton();
    },
    reset: function () {
        this.isNan && this.dataLogs();
        cc.RedT.setting.taixiu.data.taixiu.red_me_tai = 0;
        cc.RedT.setting.taixiu.data.taixiu.red_me_xiu = 0;
        cc.RedT.setting.taixiu.data.taixiu.red_player_tai = 0;
        cc.RedT.setting.taixiu.data.taixiu.red_player_xiu = 0;
        cc.RedT.setting.taixiu.data.taixiu.red_tai = 0;
        cc.RedT.setting.taixiu.data.taixiu.red_xiu = 0;
        cc.RedT.setting.taixiu.data.taixiu.xu_me_tai = 0;
        cc.RedT.setting.taixiu.data.taixiu.xu_me_xiu = 0;
        cc.RedT.setting.taixiu.data.taixiu.xu_player_tai = 0;
        cc.RedT.setting.taixiu.data.taixiu.xu_player_xiu = 0;
        cc.RedT.setting.taixiu.data.taixiu.xu_tai = 0;
        cc.RedT.setting.taixiu.data.taixiu.xu_xiu = 0;
        this.totalLeft.string = 0;
        this.totalRight.string = 0;
        this.myLeft.string = 0;
        this.myRight.string = 0;

        this.playerLeft.string = this.playerRight.string = "0%";
        this.gameAudios && this.gameAudios.playStartGameAudio();
    },
    setDefautl: function () {
        void 0 !== this.timeInterval && clearInterval(this.timeInterval);
    },
    status: function (data) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }

        this.currentStatus = data;
    },
    showResult: function () {
        if (!cc.RedT.GAME_IS_SHOWED || this.isUM) {
            return;
        }
        this.nodeKetQua.active = true;
        this.efStop();
        if (this.diemSo > 10) {
            this.efTai.play();
            this.winningTai.node.active = true;
            this.winningTai.play();
        } else {
            this.efXiu.play();
            this.winningXiu.node.active = true;
            this.winningXiu.play();
        }
    },
    showBetWinLoss: function () {
        setTimeout(
            function () {
                if (!this.isNan) {
                    this.currentStatus && this.showBetWinLossAnimation(this.currentStatus);
                }
                cc.RedT.send({
                    taixiu: {
                        get_new: true
                    }
                });
            }.bind(this),
            1000
        );
    },
    showBetWinLossAnimation: function (data) {
        if (!cc.RedT.GAME_IS_SHOWED || !this.notice) {
            return;
        }

        var temp = new cc.Node();
        temp.addComponent(cc.Label);
        temp = temp.getComponent(cc.Label);
        temp.string = (data.win ? "+" : "-") + numberWithCommas(data.bet);
        temp.font = data.win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 22;
        temp.node.position = cc.v2(data.select ? -252 : 252, -50);
        this.notice.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(2, cc.v2(data.select ? -252 : 252, 130)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
        if (void 0 !== data.thuong && data.thuong > 0) {
            var thuong = new cc.Node();
            thuong.addComponent(cc.Label);
            thuong = thuong.getComponent(cc.Label);
            thuong.string = (data.win ? "+" : "-") + numberWithCommas(data.thuong);
            thuong.font = cc.RedT.util.fontEffect;
            thuong.lineHeight = 90;
            thuong.fontSize = 14;
            this.notice.addChild(thuong.node);
            thuong.node.runAction(
                cc.sequence(
                    cc.moveTo(3, cc.v2(0, 100)),
                    cc.callFunc(function () {
                        this.node.destroy();
                    }, thuong)
                )
            );
        }
    },
    closeProcessingWarningPopup: function () {
        this.waitingBetResponse = false;

        if (this.processingWarningPopup !== undefined) {
            this.processingWarningPopup.close();
        }
    },
    onGameHide() {
        this.timeInterval && clearInterval(this.timeInterval);
        this.resetUI();
        this.totalLeft.string = this.totalRight.string = this.myLeft.string = this.myRight.string = "";
        this.playerLeft.string = this.playerRight.string = "0%";
    },
    resetBetButtonText(select) {
        if (!select || select === "left") {
            this.inputLTxt.string = "ĐẶT CỬA";
        }
        if (!select || select === "right") {
            this.inputRTxt.string = "ĐẶT CỬA";
        }
    },
    playCenterRoundLight() {
        this.centerRoundLight.node.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    },

    showBalanceBetNotice() {
        this.balanceBetNotice = cc.instantiate(this.balanceBetNoticePrefab);
        this.balanceBetNoticeContainer.addChild(this.balanceBetNotice);
    },

    balanceBet(showNotice = false) {
        const isLechTai = this.redTai > this.redXiu;
        const hasAnimation = showNotice && !this.balanceBetNotice;
        hasAnimation && this.showBalanceBetNotice();
        if (isLechTai) {
            if (hasAnimation) {
                numberTo(this.totalLeft, 0, this.redXiu, 1000, true);
            } else {
                this.totalLeft.string = numberWithCommas(this.redXiu);
            }
            this.totalRight.string = numberWithCommas(this.redXiu);
        } else {
            if (hasAnimation) {
                numberTo(this.totalRight, 0, this.redTai, 1000, true);
            } else {
                this.totalRight.string = numberWithCommas(this.redTai);
            }
            this.totalLeft.string = numberWithCommas(this.redTai);
        }
    },

    hideBetBalanceNotice() {
        this.balanceBetNoticeContainer.destroyAllChildren();
        this.balanceBetNotice = null;
    },

    disableHistoryButton() {
        this.historyButton.opacity = 130;
        const button = this.historyButton.getComponent(cc.Button);
        button.interactable = false;
    },

    enableHistoryButton() {
        this.historyButton.opacity = 255;
        const button = this.historyButton.getComponent(cc.Button);
        button.interactable = true;
    },

    initBetBoard() {
        const betBoardNode = cc.instantiate(this.betBoardPrefab);
        this.betBoard = betBoardNode.getComponent("BetBoard");
        this.betBoard.callback = {
            getPreset: () => {
                return this.presetBetValue;
            },
            acceptedBet: (info) => {
                this.onCuocClick();
            },
            changedBet: (info) => {
                this.setCurrentBetInput(info.bet);
            },
            cancel: (info) => {
                this.resetBetButtonText(info.choice);
                this.setBetButtonClicked(false, info.choice);
            }
        };
        this.betBoard.node.active = false;
        this.betBoardContainer && this.betBoardContainer.addChild(betBoardNode);
    },

    setCurrentBetInput(value) {
        this.input.string = numberWithCommas(value > this.MAX_BET ? this.MAX_BET : value);
        this.input.node.active = true;
    },

    onCuocClick() {
        var bet = getOnlyNumberInString(this.input.string);
        bet = parseInt(bet);
        this.resetBetButtonText();
        this.betBoard.node.active = false;
        this.setBetButtonClicked(false);

        if (this.waitingBetResponse) {
            var processingWarning = cc.instantiate(this.ProcessingWarning);
            this.processingWarningPopup = processingWarning.getComponent("ProcessingWarning");
            this.notice.addChild(processingWarning);
            return;
        }

        this.waitingBetResponse = true;
        this.sendBetData(bet);
    },
    sendBetData(bet) {
        cc.RedT.send({
            taixiu: {
                cuoc: {
                    red: this.red,
                    taixiu: this.taixiu,
                    select: this.inputOld === "left",
                    bet: bet
                }
            }
        });
    },

    adjustPosition() {
        const okButtonPositionY = this.betBoard.okButton.node.parent.convertToWorldSpaceAR(this.betBoard.okButton.node.position).y;
        const expectPositionY = this.betBoard.okButton.node.height;
        const paddingBottom = 20;

        if (okButtonPositionY < expectPositionY) {
            const distance = expectPositionY - okButtonPositionY + paddingBottom;

            this.node.runAction(cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackOut()));
        }
    }
});
