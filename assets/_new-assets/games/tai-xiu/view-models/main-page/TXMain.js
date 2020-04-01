var TX_Board = require("TXBoard"),
  TX_Chat = require("TXChat"),
  BrowserUtil = require("BrowserUtil"),
  helper = require("Helper"),
  TaiXiu_efScale = require("TXScale"),
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
    betTime: {
      default: null,
      type: cc.Node
    },
    firstBetTime: {
      default: null,
      type: cc.Sprite
    },
    secondBetTime: {
      default: null,
      type: cc.Sprite
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
    cointRED: {
      default: null,
      type: cc.Node
    },
    cointXU: {
      default: null,
      type: cc.Node
    },
    dotLogs: {
      default: null,
      type: cc.Node
    },
    gameCover: {
      default: null,
      type: cc.Label
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
    fontCong: {
      default: null,
      type: cc.BitmapFont
    },
    fontTru: {
      default: null,
      type: cc.BitmapFont
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
    TX_Board: TX_Board,
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
    UMWarning: {
      default: null,
      type: cc.Node
    },
    ProcessingWarning: {
      default: null,
      type: cc.Prefab
    },
  },
  init: function (obj) {
    this.TXRoot = obj;
    cc.RedT.setting.taixiu.data = cc.RedT.setting.taixiu.data || {
      taixiu: {},
      chanle: {},
      du_day: {}
    };

    this.isNan = false;

    if (void 0 === cc.RedT.util.fontCong) {
      cc.RedT.util.fontCong = this.fontCong;
      cc.RedT.util.fontTru = this.fontTru;
    }

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
      if (this.isNan) {
      } else {
        this.dataLogs();
        this.showResult();
      }
      this.diceAnimation.node.active = false;
    };

    if (cc.RedT.setting.taixiu.getLogs) {
      if (void 0 !== cc.RedT.setting.taixiu.position) {
        this.node.position = cc.RedT.setting.taixiu.position;
      }
      if (void 0 !== cc.RedT.setting.taixiu.time_remain) {
        cc.RedT.setting.taixiu.time_remain++;
        this.nextRealTime();
      }
      this.reLoadGame();
    }
  },
  onLoad() {
    this.waitingBetResponse = false;
    var self = this;
    this.ttOffset = null;
    this.editboxs = [this.inputLeft, this.inputRight];
    this.TX_Board.init(this);
    this.TX_Chat.init(this);

    this.diaNan.getComponent("TXDiaNan").init(this);

    this.centerRoundLight.node.runAction(
      cc.repeatForever(cc.rotateBy(1.1, 360))
    );

    this.keyHandle = function (t) {
      return t.keyCode === cc.macro.KEY.tab
        ? (self.changeNextFocusEditBox(),
          t.preventDefault && t.preventDefault(),
          !1)
        : t.keyCode === cc.macro.KEY.enter
          ? (BrowserUtil.focusGame(),
            self.onCuocClick(),
            t.preventDefault && t.preventDefault(),
            !1)
          : void 0;
    };

    this.diceAnimation.on("finished", this.onDiceAnimationFinish, this);

    this.onCuocClick = function () {
      var bet = helper.getOnlyNumberInString(self.input.string);
      bet = parseInt(bet);
      self.input.string = "ĐẶT CƯỢC";
      self.TX_Board.node.active = false;
      this.setBetButtonClicked(false);
      if (isNaN(bet) || bet < Constants.minBet) {
        NoticeUtil.showNoticeMessage(
          this,
          "Tiền cược tối thiểu là " + Constants.minBet
        );
      } else if (bet > Constants.maxBet) {
        NoticeUtil.showNoticeMessage(
          this,
          "Tiền cược tối đa là " + Constants.maxBet
        );
      } else {
        if (this.waitingBetResponse) {
          var processingWarning = cc.instantiate(this.ProcessingWarning);
          this.processingWarningPopup = processingWarning.getComponent("ProcessingWarning");
          this.notice.addChild(processingWarning);
          return;
        }

        this.waitingBetResponse = true;

        cc.RedT.send({
          taixiu: {
            cuoc: {
              red: self.red,
              taixiu: self.taixiu,
              select: self.inputOld == "left",
              bet: bet
            }
          }
        });
      }
    };
    if (this.TXRoot.board) {
      this.inputL.active = this.inputR.active = false;
      this.inputLeft.node.active = this.inputRight.node.active = true;
    }
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
    let value = helper.numberWithCommas(
      helper.getOnlyNumberInString(this.value)
    );
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
    }
    !t &&
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
    this.gameCover.string = this.taixiu ? "Chẵn Lẻ" : "Tài Xỉu";
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
    this.spriteNan.spriteFrame = this.isNan
      ? this.frameNan[1]
      : this.frameNan[0];
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
    this.setPhien();
  },
  onChangerRED: function () {
    cc.RedT.setting.taixiu.red = this.red = !this.red;
    this.cointRED.active = !this.cointRED.active;
    this.cointXU.active = !this.cointXU.active;
    this.totalLeft.node.color = this.totalRight.node.color = this.red
      ? this.totalRight.node.color.fromHEX("#FFEB0A")
      : this.totalRight.node.color.fromHEX("#FFFFFF");
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
      }
      else {
        this.inputL.spriteFrame = this.BetButtonClickedFrame;
      }
    }
    else {
      this.inputL.spriteFrame = this.BetButtonUnClickedFrame;
      this.inputR.spriteFrame = this.BetButtonUnClickedFrame;
    }
  },
  onSelectInput: function (event, select) {
    if (this.TX_Board.node.active) {
      return;
    }

    this.setBetButtonClicked(true, select);
    this.TX_Board.node.active = true;
    this.inputOld = select;
    switch (select) {
      case "right":
        this.input = this.TXRoot.board ? this.inputRight : this.inputRTxt;
        break;

      case "left":
        this.input = this.TXRoot.board ? this.inputLeft : this.inputLTxt;
        break;
    }
  },
  onChangerInput: function () {
    var value = helper.numberWithCommas(
      helper.getOnlyNumberInString(this.input.string)
    );
    this.input.string = value == "0" ? "" : value;
  },
  setPhienLabel: function (phien) {
    if (phien === "") {
      this.labelPhien.string = "";
      return;
    }
    this.labelPhien.string = "#" + phien;
  },
  setPhien: function () {
    // if (cc.RedT.setting.taixiu.logs === undefined) {
    //   return;
    // }
    // var phien = cc.RedT.setting.taixiu.logs[0].phien + 1;
    // this.labelPhien.string = "#" + phien;
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
    if (void 0 !== data.um) {
      if (!this.isUM) {
        this.isUM = true;
        this.UMWarning.active = true;
        this.centerRoundLight.node.stopAllActions();
      }

      return;
    }

    if (this.isUM) {
      this.isUM = false;
      this.centerRoundLight.node.runAction(
        cc.repeatForever(cc.rotateBy(1.1, 360))
      );
      this.UMWarning.active = false;
    }

    if (void 0 !== data.get_phien) {
      this.TXRoot.TXBetHistory.onData(data.get_phien);
    }
    if (void 0 !== data.apiError) {
      this.closeProcessingWarningPopu();
    }
    if (void 0 !== data.err) {
      this.closeProcessingWarningPopu();
      NoticeUtil.showNoticeMessage(this, data.err);
    }
    if (void 0 !== data.du_day) {
      Object.assign(cc.RedT.setting.taixiu.data.du_day, data.du_day);
      this.onDuDay(data.du_day);
    }
    if (void 0 !== data.taixiu) {
      Object.assign(cc.RedT.setting.taixiu.data.taixiu, data.taixiu);
      this.taixiu && this.onDataTaiXiu(data.taixiu);
    }
    if (void 0 !== data.chanle) {
      Object.assign(cc.RedT.setting.taixiu.data.chanle, data.chanle);
      !this.taixiu && this.onDataChanLe(data.chanle);
    }
    if (void 0 !== data.get_top) {
      this.TXRoot.TXTop.onData(data.get_top);
    }
    if (void 0 !== data.chat) {
      this.TX_Chat.onData(data.chat);
    }
    if (void 0 !== data.status) {
      this.status(data.status);
    }
    if (void 0 !== data.get_log) {
      this.TXRoot.TXHistory.onData(data.get_log);
    }

    this.onDataLogs(data);

    if (void 0 !== data.time_remain) {
      cc.RedT.setting.taixiu.time_remain = data.time_remain;
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
      this.dataLogs();
      this.setPhien();
      if (cc.RedT.setting.taixiu.time_remain >= Constants.betTime) {
        this.setDice(!0);
        this.nodeTimeWait.active = true;
        this.AnimatedTime.node.active = false;
      }
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
        cc.RedT.setting.taixiu.logs.length > 120 &&
          cc.RedT.setting.taixiu.logs.pop();
        // Đặt dữ liệu
        this.diemSo =
          data.finish.dices[0] + data.finish.dices[1] + data.finish.dices[2];
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
        this.nodeTimeWait.active = true;
        this.AnimatedTime.node.active = false;
      }
      cc.RedT.setting.taixiu.time_remain =
        Constants.betTime + Constants.waitTime;
      this.playTime();
    }
  },
  playTime: function () {
    void 0 !== this.timeInterval && clearInterval(this.timeInterval);
    var self = this;

    this.timeInterval = setInterval(
      function () {
        if (cc.RedT.setting.taixiu.time_remain > Constants.betTime) {
          var time = helper.numberPad(
            cc.RedT.setting.taixiu.time_remain - Constants.betTime - 1,
            2
          );
          this.showWaitTime(time);

          if (cc.RedT.setting.taixiu.time_remain < Constants.nanTime) {
            if (this.isNan) {
              this.showResult();
              this.diaNan.active = false;
            }
          }

          if (cc.RedT.setting.taixiu.logs) {
            this.setPhienLabel(cc.RedT.setting.taixiu.logs[0].phien);
          }
        } else {
          if (cc.RedT.setting.taixiu.logs) {
            this.setPhienLabel(cc.RedT.setting.taixiu.logs[0].phien + 1);
          }
          if (!!this.dice[0].node.active) {
            this.setDice(false, false);
            this.reset();
          }
          this.efStop();
          this.nodeTimeWait.active = this.nodeKetQua.active = this.diaNan.active = false;
          if (cc.RedT.setting.taixiu.time_remain > Constants.minBetTime) {
            var time = helper.numberPad(
              cc.RedT.setting.taixiu.time_remain - 1,
              2
            );
            this.AnimatedTime.setTime(time);
            this.spriteNan.node.active = this.AnimatedTime.node.active = !self.isUM;
          } else clearInterval(this.timeInterval);
        }
        cc.RedT.setting.taixiu.time_remain--;
      }.bind(this),
      1000
    );
  },
  nextRealTime: function () {
    if (cc.RedT.setting.taixiu.time_remain > Constants.betTime) {
      this.setDice(true);
      this.nodeTimeWait.active = true;
      this.AnimatedTime.node.active = false;

      var time = helper.numberPad(
        cc.RedT.setting.taixiu.time_remain - Constants.betTime - 1,
        2
      );
      this.showWaitTime(time);
    } else {
      this.nodeTimeWait.active = false;
      this.AnimatedTime.node.active = true;
      if (cc.RedT.setting.taixiu.time_remain > Constants.minBetTime) {
        var time = helper.numberPad(cc.RedT.setting.taixiu.time_remain - 1, 2);
        this.AnimatedTime.setTime(time);
      }
    }
  },
  showWaitTime: function (time) {
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

    if (this.red) {
      if (void 0 !== data.red_me_tai || void 0 !== data.red_me_xiu) {
        this.closeProcessingWarningPopu();
      }

      if (void 0 !== data.red_tai) {
        var sTai = helper.getOnlyNumberInString(this.totalLeft.string);

        if (sTai - data.red_tai != 0) {
          helper.numberTo(this.totalLeft, sTai, data.red_tai, 500, true);
        }
      }
      if (void 0 !== data.red_xiu) {
        var sXiu = helper.getOnlyNumberInString(this.totalRight.string);

        if (sXiu - data.red_xiu != 0) {
          helper.numberTo(this.totalRight, sXiu, data.red_xiu, 500, true);
        }
      }

      void 0 !== data.red_me_tai &&
        (this.myLeft.string = helper.numberWithCommas(data.red_me_tai));
      void 0 !== data.red_me_xiu &&
        (this.myRight.string = helper.numberWithCommas(data.red_me_xiu));
      void 0 !== data.red_player_tai &&
        (this.playerLeft.string = helper.numberWithCommas(data.red_player_tai));
      void 0 !== data.red_player_xiu &&
        (this.playerRight.string = helper.numberWithCommas(
          data.red_player_xiu
        ));
    } else {
      void 0 !== data.xu_tai &&
        (this.totalLeft.string = helper.numberWithCommas(data.xu_tai));
      void 0 !== data.xu_xiu &&
        (this.totalRight.string = helper.numberWithCommas(data.xu_xiu));
      void 0 !== data.xu_me_tai &&
        (this.myLeft.string = helper.numberWithCommas(data.xu_me_tai));
      void 0 !== data.xu_me_xiu &&
        (this.myRight.string = helper.numberWithCommas(data.xu_me_xiu));
      void 0 !== data.xu_player_tai &&
        (this.playerLeft.string = helper.numberWithCommas(data.xu_player_tai));
      void 0 !== data.xu_player_xiu &&
        (this.playerRight.string = helper.numberWithCommas(data.xu_player_xiu));
    }
  },
  onDuDay: function (data) {
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
            dot.mod.text.string =
              data.dice[0] + "-" + data.dice[1] + "-" + data.dice[2];
            dot.spriteFrame = self.taixiu
              ? point < 11
                ? self.dot_white
                : self.dot_black
              : point % 2
                ? self.dot_black
                : self.dot_yellow;
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

          line_dice1[i] = { x: i * 28, y: dice1 * 28 - 28, dice: dice1 };
          line_dice2[i] = { x: i * 28, y: dice2 * 28 - 28, dice: dice2 };
          line_dice3[i] = { x: i * 28, y: dice3 * 28 - 28, dice: dice3 };
          line_tong[i] = { x: i * 27.7, y: tong * 9.233 - 27.7, tong: tong };
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
        dot.spriteFrame = self.taixiu
          ? point < 11
            ? self.dot_white
            : self.dot_black
          : point % 2
            ? self.dot_black
            : self.dot_yellow;
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
              var type = self.taixiu
                ? data_Cel > 10
                  ? true
                  : false
                : data_Cel % 2
                  ? false
                  : true;
              c_tai = type ? c_tai + 1 : c_tai;
              c_xiu = !type ? c_xiu + 1 : c_xiu;
              current.active = true;
              current.color = self.taixiu
                ? type
                  ? cc.Color.BLACK
                  : cc.Color.WHITE
                : type
                  ? cc.Color.YELLOW
                  : cc.Color.BLACK;
              current.text.string = data_Cel;
              current.text.node.color = self.taixiu
                ? type
                  ? cc.Color.WHITE
                  : cc.Color.BLACK
                : type
                  ? cc.Color.BLACK
                  : cc.Color.WHITE;
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
  resetUI() {
    this.efStop();
    this.AnimatedTime.node.active = false;
    this.diceAnimation.node.active = false;
    this.setDice(false, false);
  },
  reset: function () {
    this.resetUI();
    this.setPhien();
    this.isNan && this.dataLogs();
    cc.RedT.setting.taixiu.data.chanle.red_chan = cc.RedT.setting.taixiu.data.chanle.red_le = cc.RedT.setting.taixiu.data.chanle.red_me_chan = cc.RedT.setting.taixiu.data.chanle.red_me_le = cc.RedT.setting.taixiu.data.chanle.red_player_chan = cc.RedT.setting.taixiu.data.chanle.red_player_le = cc.RedT.setting.taixiu.data.chanle.xu_chan = cc.RedT.setting.taixiu.data.chanle.xu_le = cc.RedT.setting.taixiu.data.chanle.xu_me_chan = cc.RedT.setting.taixiu.data.chanle.xu_me_le = cc.RedT.setting.taixiu.data.chanle.xu_player_chan = cc.RedT.setting.taixiu.data.chanle.xu_player_le = cc.RedT.setting.taixiu.data.taixiu.red_me_tai = cc.RedT.setting.taixiu.data.taixiu.red_me_xiu = cc.RedT.setting.taixiu.data.taixiu.red_player_tai = cc.RedT.setting.taixiu.data.taixiu.red_player_xiu = cc.RedT.setting.taixiu.data.taixiu.red_tai = cc.RedT.setting.taixiu.data.taixiu.red_xiu = cc.RedT.setting.taixiu.data.taixiu.xu_me_tai = cc.RedT.setting.taixiu.data.taixiu.xu_me_xiu = cc.RedT.setting.taixiu.data.taixiu.xu_player_tai = cc.RedT.setting.taixiu.data.taixiu.xu_player_xiu = cc.RedT.setting.taixiu.data.taixiu.xu_tai = cc.RedT.setting.taixiu.data.taixiu.xu_xiu = this.totalLeft.string = this.totalRight.string = this.myLeft.string = this.myRight.string = this.playerLeft.string = this.playerRight.string = 0;
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
    setTimeout(
      function () {
        if (!this.isNan) {
          this.showBetWinLoss(data);
        }
        cc.RedT.send({ taixiu: { get_new: true } });
      }.bind(this),
      2e3
    );
  },
  showResult: function () {
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
    // if (this.diemSo % 2) {
    //   this.efLe.play();
    // } else {
    //   this.efChan.play();
    // }
  },
  showBetWinLoss: function (data) {
    if (!cc.RedT.GAME_IS_SHOWED) {
      return;
    }
    var temp = new cc.Node();
    temp.addComponent(cc.Label);
    temp = temp.getComponent(cc.Label);
    temp.string = (data.win ? "+" : "-") + helper.numberWithCommas(data.bet);
    temp.font = data.win ? this.fontCong : this.fontTru;
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
  }
});
