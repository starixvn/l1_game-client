var TX_Chat = require("TXChat"),
  BrowserUtil = require("BrowserUtil"),
  helper = require("Helper"),
  TaiXiu_efScale = require("TXScale"),
  Constants = require("TXConstants"),
  NoticeUtil = require("NoticeUtil");
import UmWarning from '../../../../common/um-warning/UmWarning';

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
    inputLeft: {
      default: null,
      type: cc.EditBox
    },
    inputRight: {
      default: null,
      type: cc.EditBox
    },
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
    efTai: TaiXiu_efScale,
    efXiu: TaiXiu_efScale,
    efChan: TaiXiu_efScale,
    efLe: TaiXiu_efScale,
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
    TX_Chat: TX_Chat,
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
    userBetBigPercent: {
      default: null,
      type: cc.Sprite
    },
    userBetSmallPercent: {
      default: null,
      type: cc.Sprite
    },
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
    this.MAX_BET = 1000;
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
    ).then(resulf => {
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
    var self = this;
    this.ttOffset = null;
    this.editboxs = [this.inputLeft, this.inputRight];
    this.initBetBoard();
    this.TX_Chat.init(this);

    this.diaNan.getComponent("TXDiaNan").init(this);

    this.playCenterRoundLight();

    this.keyHandle = function (t) {
      return t.keyCode === cc.macro.KEY.tab ?
        (self.changeNextFocusEditBox(),
          t.preventDefault && t.preventDefault(),
          !1) :
        t.keyCode === cc.macro.KEY.enter ?
          (BrowserUtil.focusGame(),
            self.onCuocClick(),
            t.preventDefault && t.preventDefault(),
            !1) :
          void 0;
    };

    this.diceAnimation.on("finished", this.onDiceAnimationFinish, this);

    if (this.TXRoot.board) {
      this.inputL.active = this.inputR.active = false;
      this.inputLeft.node.active = this.inputRight.node.active = true;
    }

    var extendTouchPartComponent = this.extendTouchPart.getComponent("ExtendTouchPart");
    if (extendTouchPartComponent) {
      extendTouchPartComponent.listener = {
        eventStart: (e) => this.eventStart(e),
        eventMove: (e) => this.eventMove(e),
        eventEnd: () => this.eventEnd(),
      }
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
    // this.background.on(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
    this.TXRoot.board && cc.sys.isBrowser && this.addEvent();

    if (this.TXRoot.board) {
      BrowserUtil.inputAddEvent(this.inputLeft, "input", this.updateValue);
      BrowserUtil.inputAddEvent(this.inputRight, "input", this.updateValue);
    }
  },
  onDisable: function () {
    this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    this.background.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
    this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    // this.background.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);

    this.TXRoot.board && cc.sys.isBrowser && this.removeEvent();
    this.clean();

    if (this.TXRoot.board) {
      BrowserUtil.inputRemoveEvent(this.inputLeft, "input", this.updateValue);
      BrowserUtil.inputRemoveEvent(this.inputRight, "input", this.updateValue);
    }
  },
  updateValue: function (e) {
    let value = helper.numberWithCommas(helper.getOnlyNumberInString(this.value));
    this.value = value == "0" ? "" : value;
  },
  addEvent: function () {
    for (let t in this.editboxs) {
      BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener(
        "keydown",
        this.keyHandle,
        !1
      );
    }
  },
  removeEvent: function () {
    for (let t in this.editboxs) {
      BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener(
        "keydown",
        this.keyHandle,
        !1
      );
    }
  },
  changeNextFocusEditBox: function () {
    for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++) {
      if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
        BrowserUtil.focusEditBox(this.editboxs[e]);
        t = !0;
        break;
      }
    } !t &&
      0 < this.editboxs.length &&
      BrowserUtil.focusEditBox(this.editboxs[1]);
  },
  clean: function () {
    this.inputLeft.string = this.inputRight.string = "";
  },
  initGame: function (taixiu) {
    if (taixiu != this.taixiu) {
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
      !this.taixiu && this.onDataChanLe(cc.RedT.setting.taixiu.data.chanle);
      this.onDuDay(cc.RedT.setting.taixiu.data.du_day);
    }
  },
  onChangerNan: function () {
    cc.RedT.setting.taixiu.isNan = this.isNan = !this.isNan;
    this.spriteNan.spriteFrame = this.isNan ?
      this.frameNan[1] :
      this.frameNan[0];
  },
  reLoadGame: function () {
    setTimeout(
      function () {
        if (cc.RedT.setting.taixiu.red != this.red) {
          this.onChangerRED();
        }
        if (cc.RedT.setting.taixiu.taixiu != this.taixiu) {
          this.onChangerGame();
        } else {
          this.dataLogs();
        }
        if (cc.RedT.setting.taixiu.isNan != this.isNan) {
          this.onChangerNan();
        }
        //if (void 0 !== data.du_day) {
        this.onDuDay(cc.RedT.setting.taixiu.data.du_day);
        //}
        if (cc.RedT.setting.taixiu.taixiu) {
          this.onDataTaiXiu(cc.RedT.setting.taixiu.data.taixiu);
        } else {
          this.onDataChanLe(cc.RedT.setting.taixiu.data.chanle);
        }
      }.bind(this),
      50
    );
  },
  onChangerRED: function () {
    cc.RedT.setting.taixiu.red = this.red = !this.red;
    this.totalLeft.node.color = this.totalRight.node.color = this.red ?
      this.totalRight.node.color.fromHEX("#FFEB0A") :
      this.totalRight.node.color.fromHEX("#FFFFFF");
    //FIX ME: TX_LichSuPhien NOT FOUND
    this.TXRoot.TX_LichSuPhien.onChangerCoint();
    this.taixiu && this.onDataTaiXiu(cc.RedT.setting.taixiu.data.taixiu);
    !this.taixiu && this.onDataChanLe(cc.RedT.setting.taixiu.data.chanle);
    this.onDuDay(cc.RedT.setting.taixiu.data.du_day);
  },
  eventStart: function (e) {
    this.setTop();
    this.ttOffset = cc.v2(
      e.touch.getLocationX() - this.node.position.x,
      e.touch.getLocationY() - this.node.position.y
    );
  },
  eventMove: function (e) {
    this.node.position = cc.v2(
      e.touch.getLocationX() - this.ttOffset.x,
      e.touch.getLocationY() - this.ttOffset.y
    );


  },
  eventEnd: function () {
    cc.RedT.setting.taixiu.position = this.node.position;
  },
  setTop: function () {
    this.node.parent.insertChild(this.node);
    this.TXRoot.setTop();
  },
  setBetButtonClicked(isClick, select) {
    if (isClick) {
      if (select == "right") {
        this.inputR.spriteFrame = this.BetButtonClickedFrame;
      } else {
        this.inputL.spriteFrame = this.BetButtonClickedFrame;
      }
    } else {
      this.inputL.spriteFrame = this.BetButtonUnClickedFrame;
      this.inputR.spriteFrame = this.BetButtonUnClickedFrame;
    }
  },
  onSelectInput: function (event, select) {
    if (this.betBoard.node.active) {
      return;
    }

    this.setBetButtonClicked(true, select);
    this.inputOld = select;
    switch (select) {
      case "right":
        this.input = this.TXRoot.board ? this.inputRight : this.inputRTxt;
        break;

      case "left":
        this.input = this.TXRoot.board ? this.inputLeft : this.inputLTxt;
        break;
    }

    const info = {
      choice: null,
      bet: 0,
      betItem: null,
      maxBet: this.MAX_BET
    }
    this.betBoard.show(info);
    this.adjustPosition();
  },
  onChangerInput: function () {
    var value = helper.numberWithCommas(helper.getOnlyNumberInString(this.input.string));
    this.input.string = value == "0" ? "" : value;
  },
  setPhienLabel: function (phien) {
    if (phien === "") {
      this.labelPhien.string = "";
      return;
    }
    this.labelPhien.string = "#" + phien;
  },
  setDice: function (bool = false, sprite = true) {
    var self = this;
    Promise.all(
      this.dice.map(function (dice, index) {
        sprite &&
          (dice.spriteFrame =
            self.diceSF[cc.RedT.setting.taixiu.logs[0].dice[index] - 1]);
        dice.node.active = bool;
      })
    );
  },
  onData: function (data) {
    if (data.um) {
      if (cc.RedT.setting.taixiu.time_remain == Constants.betTime || data.time_remain == Constants.fullTime) {
        this.isUM = true;
        this.UMWarning.show(data);
        this.centerRoundLight.node.stopAllActions();
        this.onGameHide();

        return;
      }
    }

    if (data.get_phien) {
      this.TXRoot.TXBetHistory.node && this.TXRoot.TXBetHistory.onData(data.get_phien);
    }
    if (data.apiError) {
      this.closeProcessingWarningPopup();
    }
    if (data.err) {
      this.closeProcessingWarningPopup();
      NoticeUtil.showNoticeMessage(this, data.err);
    }
    if (data.du_day) {
      Object.assign(cc.RedT.setting.taixiu.data.du_day, data.du_day);
      this.onDuDay(data.du_day);
    }
    if (data.taixiu && !this.isUM) {
      Object.assign(cc.RedT.setting.taixiu.data.taixiu, data.taixiu);
      this.taixiu && this.onDataTaiXiu(data.taixiu);
    }
    if (data.chanle) {
      Object.assign(cc.RedT.setting.taixiu.data.chanle, data.chanle);
      !this.taixiu && this.onDataChanLe(data.chanle);
    }
    if (data.get_top) {
      this.TXRoot.TXTop.node && this.TXRoot.TXTop.onData(data.get_top);
    }
    if (data.chat) {
      this.TX_Chat.onData(data.chat);
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
  onDataLogs: function (data) {
    if (void 0 !== data.logs) {
      cc.RedT.setting.taixiu.logs = data.logs;
      this.localResultDices = [...data.logs[0].dice];
      if (cc.RedT.setting.taixiu.time_remain > Constants.betTime && cc.RedT.setting.taixiu.time_remain < Constants.displayResultTime) {
        this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
        this.labelKetQua.string = this.diemSo;
        // if (!this.isNan) {
        this.setDice(true);
        this.showResult();
        // }
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
          dice: [
            data.finish.dices[0],
            data.finish.dices[1],
            data.finish.dices[2]
          ],
          phien: data.finish.phien
        });
        cc.RedT.setting.taixiu.logs.length > 120 && cc.RedT.setting.taixiu.logs.pop();
        //this.dataLogs();
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
    var self = this;

    this.timeInterval = setInterval(
      function () {
        if (cc.RedT.setting.taixiu.time_remain > Constants.betTime) {
          const isBalanceBetTime = cc.RedT.setting.taixiu.time_remain > Constants.displayResultTime;
          if (isBalanceBetTime) {
            this.balanceBet(cc.RedT.setting.taixiu.time_remain == Constants.fullTime);
          } else {
            this.hideBetBalanceNotice();
            this.enableHistoryButton();
            if (cc.RedT.setting.taixiu.time_remain == Constants.displayResultTime) {
              this.displayDiceResult();
              this.showBetWinLoss()
            }
            // time count down to next phien
            var time = helper.numberPad(cc.RedT.setting.taixiu.time_remain - Constants.betTime - 1, 2);
            this.showWaitTime(time);

            if (this.localResultDices.length > 0) {
              this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
              this.labelKetQua.string = this.diemSo;
              this.updateShowResult();
            }
            if (cc.RedT.setting.taixiu.logs) {
              this.setPhienLabel(cc.RedT.setting.taixiu.logs[0].phien);
            }
          }
        } else {
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
            var time = helper.numberPad(
              cc.RedT.setting.taixiu.time_remain - 1,
              2
            );
            this.AnimatedTime.setTime(time);
            this.spriteNan.node.active = this.AnimatedTime.node.active = !self.isUM;
          } else {
            this.disableHistoryButton();
            clearInterval(this.timeInterval);
          }
        }
        cc.RedT.setting.taixiu.time_remain--;
      }.bind(this),
      1000
    );
  },
  showWaitTime: function (time) {
    this.nodeTimeWait && (this.nodeTimeWait.active = true);
    this.timeWait.string = "00:" + helper.numberPad(time, 2);
  },
  onDataChanLe: function (data) {
    if (this.red) {
      void 0 !== data.red_chan &&
        (this.totalLeft.string = helper.numberWithCommas(data.red_chan));
      void 0 !== data.red_le &&
        (this.totalRight.string = helper.numberWithCommas(data.red_le));
      void 0 !== data.red_me_chan &&
        (this.myLeft.string = helper.numberWithCommas(data.red_me_chan));
      void 0 !== data.red_me_le &&
        (this.myRight.string = helper.numberWithCommas(data.red_me_le));
      void 0 !== data.red_player_chan &&
        (this.playerLeft.string = helper.numberWithCommas(
          data.red_player_chan
        ));
      void 0 !== data.red_player_le &&
        (this.playerRight.string = helper.numberWithCommas(data.red_player_le));
    } else {
      void 0 !== data.xu_chan &&
        (this.totalLeft.string = helper.numberWithCommas(data.xu_chan));
      void 0 !== data.xu_le &&
        (this.totalRight.string = helper.numberWithCommas(data.xu_le));
      void 0 !== data.xu_me_chan &&
        (this.myLeft.string = helper.numberWithCommas(data.xu_me_chan));
      void 0 !== data.xu_me_le &&
        (this.myRight.string = helper.numberWithCommas(data.xu_me_le));
      void 0 !== data.xu_player_chan &&
        (this.playerLeft.string = helper.numberWithCommas(data.xu_player_chan));
      void 0 !== data.xu_player_le &&
        (this.playerRight.string = helper.numberWithCommas(data.xu_player_le));
    }
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
      var sTai = helper.getOnlyNumberInString(this.totalLeft.string);

      if (sTai < data.red_tai) {
        helper.numberTo(this.totalLeft, sTai, data.red_tai, 0, true);
      } else {
        this.totalLeft.string = helper.numberWithCommas(data.red_tai);
      }
    }
    if (void 0 !== data.red_xiu) {
      var sXiu = helper.getOnlyNumberInString(this.totalRight.string);

      if (sXiu < data.red_xiu) {
        helper.numberTo(this.totalRight, sXiu, data.red_xiu, 0, true);
      } else {
        this.totalRight.string = helper.numberWithCommas(data.red_xiu);
      }
    }

    void 0 !== data.red_me_tai && (this.myLeft.string = helper.numberWithCommas(data.red_me_tai));
    void 0 !== data.red_me_xiu && (this.myRight.string = helper.numberWithCommas(data.red_me_xiu));
    if (void 0 !== data.red_player_tai) {
      const betTaiPercent = parseInt(data.red_player_tai) >> 0;
      this.playerLeft.string = betTaiPercent + "%";
      this.userBetBigPercent.fillRange = (betTaiPercent / 100);
    }
    if (void 0 !== data.red_player_xiu) {
      const betXiuPercent = parseInt(data.red_player_xiu) >> 0;
      this.playerRight.string = betXiuPercent + "%";
      this.userBetSmallPercent.fillRange = -(betXiuPercent / 100);
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
      var self = this;
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
            dot.spriteFrame = self.taixiu ?
              point < 11 ?
                self.dot_white :
                self.dot_black :
              point % 2 ?
                self.dot_black :
                self.dot_yellow;
          } else {
            dot.node.active = false;
          }
        })
      );

      if (self.TXRoot.TXStats) {
        this.updateTXStats();
      }
    }
  },
  updateTXStats() {
    var self = this;
    var line_dice1 = [];
    var line_dice2 = [];
    var line_dice3 = [];
    var line_tong = [];

    var tmp_DS = -1;
    var tmp_arrA = [];
    var tmp_arrB = [];
    var c_tai = 0;
    var c_xiu = 0;

    var sliced = cc.RedT.setting.taixiu.logs.slice(0, 19);
    sliced.reverse();
    // Line paint
    var Paint = new Promise(function (resolve, reject) {
      for (var i = 0; i < sliced.length; i++) {
        var data = sliced[i];
        if (void 0 !== data) {
          self.TXRoot.TXStats.lineAc(i, true);
          var dice1 = sliced[i].dice[0];
          var dice2 = sliced[i].dice[1];
          var dice3 = sliced[i].dice[2];
          var tong = dice1 + dice2 + dice3;

          line_dice1[i] = {
            x: i * 28,
            y: dice1 * 28 - 28,
            dice: dice1
          };
          line_dice2[i] = {
            x: i * 28,
            y: dice2 * 28 - 28,
            dice: dice2
          };
          line_dice3[i] = {
            x: i * 28,
            y: dice3 * 28 - 28,
            dice: dice3
          };
          line_tong[i] = {
            x: i * 27.7,
            y: tong * 9.233 - 27.7,
            tong: tong
          };
        } else {
          self.TXRoot.TXStats.lineAc(i, false);
        }
      }
      self.TXRoot.TXStats.draw(
        self.TXRoot.TXStats.dice1_line,
        self.TXRoot.TXStats.dice1_dots,
        line_dice1
      );
      self.TXRoot.TXStats.draw(
        self.TXRoot.TXStats.dice2_line,
        self.TXRoot.TXStats.dice2_dots,
        line_dice2
      );
      self.TXRoot.TXStats.draw(
        self.TXRoot.TXStats.dice3_line,
        self.TXRoot.TXStats.dice3_dots,
        line_dice3
      );
      self.TXRoot.TXStats.draw_Tong(
        self.TXRoot.TXStats.tong_line,
        line_tong
      );
    });

    // Ket Qua
    var ketqua = self.TXRoot.TXStats.KetQuaDot.map(function (dot, index) {
      var data = cc.RedT.setting.taixiu.logs[index];
      if (void 0 !== data) {
        dot.node.active = true;
        var point = data.dice[0] + data.dice[1] + data.dice[2];
        dot.spriteFrame = self.taixiu ?
          point < 11 ?
            self.dot_white :
            self.dot_black :
          point % 2 ?
            self.dot_black :
            self.dot_yellow;
        return self.taixiu ? (point > 10 ? 1 : 0) : point % 2 ? 0 : 1;
      } else {
        dot.node.active = false;
        return -1;
      }
    });

    // Diem So
    var newArr = cc.RedT.setting.taixiu.logs.slice();
    newArr.reverse();
    for (var newDS of newArr) {
      var point = newDS.dice[0] + newDS.dice[1] + newDS.dice[2];
      var type = self.taixiu ? (point > 10 ? 1 : 0) : point % 2 ? 0 : 1;
      if (tmp_DS === -1) {
        tmp_DS = type;
      }
      if (type != tmp_DS || tmp_arrB.length > 4) {
        tmp_DS = type;
        tmp_arrA.push(tmp_arrB);
        tmp_arrB = [];
      }
      if (type == tmp_DS) {
        tmp_arrB.push(point);
      }
    }
    tmp_arrA.push(tmp_arrB);

    var newData = tmp_arrA;
    newData.reverse();
    newData = newData.slice(0, 20);
    newData.reverse();
    self.TXRoot.TXStats.KetQuaLeft.string = ketqua.filter(
      i => i == 1
    ).length;
    self.TXRoot.TXStats.KetQuaRight.string = ketqua.filter(
      i => i == 0
    ).length;

    self.TXRoot.TXStats.DiemSoCel.forEach(function (obj, i) {
      var data = newData[i];
      if (void 0 !== data) {
        obj.active = true;
        return Promise.all(
          obj.RedT.map(function (current, index) {
            var data_Cel = data[index];
            if (void 0 !== data_Cel) {
              var type = self.taixiu ?
                data_Cel > 10 ?
                  true :
                  false :
                data_Cel % 2 ?
                  false :
                  true;
              c_tai = type ? c_tai + 1 : c_tai;
              c_xiu = !type ? c_xiu + 1 : c_xiu;
              current.active = true;
              current.color = self.taixiu ?
                type ?
                  cc.Color.BLACK :
                  cc.Color.WHITE :
                type ?
                  cc.Color.YELLOW :
                  cc.Color.BLACK;
              current.text.string = data_Cel;
              current.text.node.color = self.taixiu ?
                type ?
                  cc.Color.WHITE :
                  cc.Color.BLACK :
                type ?
                  cc.Color.BLACK :
                  cc.Color.WHITE;
            } else {
              current.active = false;
            }
            return void 0;
          })
        );
      } else {
        obj.active = false;
      }
      return void 0;
    })

    self.TXRoot.TXStats.DiemSoLeft.string = c_tai;
    self.TXRoot.TXStats.DiemSoRight.string = c_xiu;
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
    cc.RedT.setting.taixiu.data.chanle.red_chan = cc.RedT.setting.taixiu.data.chanle.red_le = cc.RedT.setting.taixiu.data.chanle.red_me_chan = cc.RedT.setting.taixiu.data.chanle.red_me_le = cc.RedT.setting.taixiu.data.chanle.red_player_chan = cc.RedT.setting.taixiu.data.chanle.red_player_le = cc.RedT.setting.taixiu.data.chanle.xu_chan = cc.RedT.setting.taixiu.data.chanle.xu_le = cc.RedT.setting.taixiu.data.chanle.xu_me_chan = cc.RedT.setting.taixiu.data.chanle.xu_me_le = cc.RedT.setting.taixiu.data.chanle.xu_player_chan = cc.RedT.setting.taixiu.data.chanle.xu_player_le = cc.RedT.setting.taixiu.data.taixiu.red_me_tai = cc.RedT.setting.taixiu.data.taixiu.red_me_xiu = cc.RedT.setting.taixiu.data.taixiu.red_player_tai = cc.RedT.setting.taixiu.data.taixiu.red_player_xiu = cc.RedT.setting.taixiu.data.taixiu.red_tai = cc.RedT.setting.taixiu.data.taixiu.red_xiu = cc.RedT.setting.taixiu.data.taixiu.xu_me_tai = cc.RedT.setting.taixiu.data.taixiu.xu_me_xiu = cc.RedT.setting.taixiu.data.taixiu.xu_player_tai = cc.RedT.setting.taixiu.data.taixiu.xu_player_xiu = cc.RedT.setting.taixiu.data.taixiu.xu_tai = cc.RedT.setting.taixiu.data.taixiu.xu_xiu = this.totalLeft.string = this.totalRight.string = this.myLeft.string = this.myRight.string = 0;
    this.playerLeft.string = this.playerRight.string = "0%";
    this.userBetBigPercent.fillRange = this.userBetSmallPercent.fillRange = 0;
    this.gameAudios && this.gameAudios.playStartGameAudio();
  },
  setDefautl: function () {
    // TODO: cc.RedT.setting.taixiu.getLogs = this.nodeTimePopup.active = false;
    void 0 !== this.timeInterval && clearInterval(this.timeInterval);
    this.TX_Chat.reset();
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
      }.bind(this), 1000);
  },
  showBetWinLossAnimation: function (data) {
    if (!cc.RedT.GAME_IS_SHOWED || !this.notice) {
      return;
    }

    var temp = new cc.Node();
    temp.addComponent(cc.Label);
    temp = temp.getComponent(cc.Label);
    temp.string = (data.win ? "+" : "-") + helper.numberWithCommas(data.bet);
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
      thuong.string =
        (data.win ? "+" : "-") + helper.numberWithCommas(data.thuong);
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
    this.totalLeft.string = this.totalRight.string = this.myLeft.string = this.myRight.string = '';
    this.playerLeft.string = this.playerRight.string = "0%";
  },
  resetBetButtonText() {
    this.inputLTxt.string = "ĐẶT CỬA"
    this.inputRTxt.string = "ĐẶT CỬA"
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
        helper.numberTo(this.totalLeft, 0, this.redXiu, 1000, true);
      } else {
        this.totalLeft.string = helper.numberWithCommas(this.redXiu);
      }
      this.totalRight.string = helper.numberWithCommas(this.redXiu);
    } else {
      if (hasAnimation) {
        helper.numberTo(this.totalRight, 0, this.redTai, 1000, true)
      } else {
        this.totalRight.string = helper.numberWithCommas(this.redTai);
      }
      this.totalLeft.string = helper.numberWithCommas(this.redTai);
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
      getPreset: () => { return this.presetBetValue; },
      acceptedBet: (info) => { this.onCuocClick(); },
      changedBet: (info) => { this.setCurrentBetInput(info.bet); },
      cancel: (info) => {
        this.resetBetButtonText();
        this.setBetButtonClicked(false);
      },
    };
    this.betBoard.node.active = false;
    this.betBoardContainer && this.betBoardContainer.addChild(betBoardNode);
  },

  setCurrentBetInput(value) {
    this.input.string = helper.numberWithCommas(value > this.MAX_BET ? this.MAX_BET : value);
    this.input.node.active = true;
  },

  onCuocClick() {
    var bet = helper.getOnlyNumberInString(this.input.string);
    bet = parseInt(bet);
    this.resetBetButtonText()
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
          select: this.inputOld == "left",
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