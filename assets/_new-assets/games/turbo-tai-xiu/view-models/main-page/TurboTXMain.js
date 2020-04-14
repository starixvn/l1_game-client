var TXMain = require("TXMain"),
  BrowserUtil = require("BrowserUtil"),
  helper = require("Helper"),
  Constants = require("TurboTXConstants"),
  NoticeUtil = require("NoticeUtil");

cc.Class({
  extends: TXMain,

  init: function (obj) {
    this.TXRoot = obj;
    cc.RedT.setting.taixiu_turbo.data = cc.RedT.setting.taixiu_turbo.data || {
      taixiu: {},
      chanle: {},
      du_day: {}
    };

    this.isNan = false;
    this.localResultDices = [];

    if (void 0 === cc.RedT.util.fontCong) {
      cc.RedT.util.fontCong = this.fontCong;
      cc.RedT.util.fontTru = this.fontTru;
    }

    if (void 0 === cc.RedT.setting.taixiu_turbo.red) {
      cc.RedT.setting.taixiu_turbo.red = this.red;
    }
    if (void 0 === cc.RedT.setting.taixiu_turbo.taixiu) {
      cc.RedT.setting.taixiu_turbo.taixiu = this.taixiu;
    }
    if (void 0 === cc.RedT.setting.taixiu_turbo.getLogs) {
      cc.RedT.setting.taixiu_turbo.getLogs = false;
    }
    if (void 0 === cc.RedT.setting.taixiu_turbo.isNan) {
      cc.RedT.setting.taixiu_turbo.isNan = false;
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
      this.showResult();
      this.diceAnimation.node.active = false;
    };

    if (cc.RedT.setting.taixiu_turbo.getLogs) {
      if (void 0 !== cc.RedT.setting.taixiu_turbo.position) {
        this.node.position = cc.RedT.setting.taixiu_turbo.position;
      }
      if (void 0 !== cc.RedT.setting.taixiu_turbo.time_remain) {
        cc.RedT.setting.taixiu_turbo.time_remain++;
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
          taixiu_turbo: {
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

  onChangerGame: function () {
    cc.RedT.setting.taixiu_turbo.taixiu = this.taixiu = !this.taixiu;
    this.gameCover.string = this.taixiu ? "Chẵn Lẻ" : "Tài Xỉu";
    this.nodeTaiXiu.active = this.taixiu;
    this.nodeChanLe.active = !this.taixiu;
    if (cc.RedT.setting.taixiu_turbo.getLogs) {
      this.dataLogs();
      self.TXRoot.TXStats.onChangerGame();
      this.TXRoot.TX_LichSuPhien.onChangerGame();
      this.taixiu && this.onDataTaiXiu(cc.RedT.setting.taixiu_turbo.data.taixiu);
      !this.taixiu && this.onDataChanLe(cc.RedT.setting.taixiu_turbo.data.chanle);
      this.onDuDay(cc.RedT.setting.taixiu_turbo.data.du_day);
    }
  },
  onChangerNan: function () {
    cc.RedT.setting.taixiu_turbo.isNan = this.isNan = !this.isNan;
    this.spriteNan.spriteFrame = this.isNan
      ? this.frameNan[1]
      : this.frameNan[0];
  },
  reLoadGame: function () {
    setTimeout(
      function () {
        if (cc.RedT.setting.taixiu_turbo.red != this.red) {
          this.onChangerRED();
        }
        if (cc.RedT.setting.taixiu_turbo.taixiu != this.taixiu) {
          this.onChangerGame();
        } else {
          this.dataLogs();
        }
        if (cc.RedT.setting.taixiu_turbo.isNan != this.isNan) {
          this.onChangerNan();
        }
        //if (void 0 !== data.du_day) {
        this.onDuDay(cc.RedT.setting.taixiu_turbo.data.du_day);
        //}
        if (cc.RedT.setting.taixiu_turbo.taixiu) {
          this.onDataTaiXiu(cc.RedT.setting.taixiu_turbo.data.taixiu);
        } else {
          this.onDataChanLe(cc.RedT.setting.taixiu_turbo.data.chanle);
        }
      }.bind(this),
      50
    );
  },
  onChangerRED: function () {
    cc.RedT.setting.taixiu_turbo.red = this.red = !this.red;
    this.cointRED.active = !this.cointRED.active;
    this.cointXU.active = !this.cointXU.active;
    this.totalLeft.node.color = this.totalRight.node.color = this.red
      ? this.totalRight.node.color.fromHEX("#FFEB0A")
      : this.totalRight.node.color.fromHEX("#FFFFFF");
    //FIX ME: TX_LichSuPhien NOT FOUND
    this.TXRoot.TX_LichSuPhien.onChangerCoint();
    this.taixiu && this.onDataTaiXiu(cc.RedT.setting.taixiu_turbo.data.taixiu);
    !this.taixiu && this.onDataChanLe(cc.RedT.setting.taixiu_turbo.data.chanle);
    this.onDuDay(cc.RedT.setting.taixiu_turbo.data.du_day);
  },

  eventEnd: function () {
    cc.RedT.setting.taixiu_turbo.position = this.node.position;
  },

  setDice: function (bool = false, sprite = true) {
    var self = this;
    Promise.all(
      this.dice.map(function (dice, index) {
        sprite &&
          (dice.spriteFrame =
            self.diceSF[cc.RedT.setting.taixiu_turbo.logs[0].dice[index] - 1]);
        dice.node.active = bool;
      })
    );
  },
  onData: function (data) {
    if (data.um) {
      if (cc.RedT.setting.taixiu_turbo.time_remain == Constants.betTime || data.time_remain == Constants.fullTime) {
        this.isUM = true;
        this.UMWarning.active = true;
        this.centerRoundLight.node.stopAllActions();
        this.onGameHide();

        return;
      }
    }

    if (data.get_phien) {
      this.TXRoot.TXBetHistory.onData(data.get_phien);
    }
    if (data.apiError) {
      this.closeProcessingWarningPopup();
    }
    if (data.err) {
      this.closeProcessingWarningPopup();
      NoticeUtil.showNoticeMessage(this, data.err);
    }
    if (data.du_day) {
      Object.assign(cc.RedT.setting.taixiu_turbo.data.du_day, data.du_day);
      this.onDuDay(data.du_day);
    }
    if (data.taixiu && !this.isUM) {
      Object.assign(cc.RedT.setting.taixiu_turbo.data.taixiu, data.taixiu);
      this.taixiu && this.onDataTaiXiu(data.taixiu);
    }
    if (data.chanle) {
      Object.assign(cc.RedT.setting.taixiu_turbo.data.chanle, data.chanle);
      !this.taixiu && this.onDataChanLe(data.chanle);
    }
    if (data.get_top) {
      this.TXRoot.TXTop.onData(data.get_top);
    }
    if (data.chat) {
      this.TX_Chat.onData(data.chat);
    }
    if (data.status) {
      this.status(data.status);
    }
    if (data.get_log) {
      this.TXRoot.TXHistory.onData(data.get_log);
    }

    if (!this.isUM) {
      this.onDataLogs(data);
    }

    if (data.time_remain) {
      this.isUM = false;
      this.centerRoundLight.node.runAction(
        cc.repeatForever(cc.rotateBy(1.1, 360))
      );
      this.UMWarning.active = false;
      cc.RedT.setting.taixiu_turbo.time_remain = data.time_remain;
      this.playTime();
    }

    this.onDataFinishPhien(data);
  },
  onDataLogs: function (data) {
    if (void 0 !== data.logs) {
      cc.RedT.setting.taixiu_turbo.logs = data.logs;
      this.localResultDices = [...data.logs[0].dice];
      if (cc.RedT.setting.taixiu_turbo.time_remain > Constants.betTime) {
        this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
        this.labelKetQua.string = this.diemSo;
        // if (!this.isNan) {
        this.setDice(true);
        this.showResult();
        // }
      }
      this.dataLogs();
      cc.RedT.setting.taixiu_turbo.getLogs = true;
    }
  },
  onDataFinishPhien: function (data) {
    if (void 0 !== data.finish) {
      if (cc.RedT.setting.taixiu_turbo.getLogs) {
        // Huỷ đếm
        void 0 !== this.timeInterval && clearInterval(this.timeInterval);
        // Thêm kết quả
        cc.RedT.setting.taixiu_turbo.logs.unshift({
          dice: [
            data.finish.dices[0],
            data.finish.dices[1],
            data.finish.dices[2]
          ],
          phien: data.finish.phien
        });
        cc.RedT.setting.taixiu_turbo.logs.length > 120 &&
          cc.RedT.setting.taixiu_turbo.logs.pop();
        this.dataLogs();
        this.localResultDices = [...data.finish.dices];
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
        this.nodeTimeWait.active = true;
        this.AnimatedTime.node.active = false;
      }
      cc.RedT.setting.taixiu_turbo.time_remain =
        Constants.betTime + Constants.waitTime;
      this.playTime();
    }
  },
  updateShowResult: function () {
    if (this.isNan) {
      if (cc.RedT.setting.taixiu_turbo.time_remain < Constants.nanTime) {
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
        if (cc.RedT.setting.taixiu_turbo.time_remain > Constants.betTime) {
          // time count down to next phien
          var time = helper.numberPad(
            cc.RedT.setting.taixiu_turbo.time_remain - Constants.betTime - 1,
            2
          );
          this.showWaitTime(time);

          if (this.localResultDices.length > 0) {
            this.diemSo = this.localResultDices[0] + this.localResultDices[1] + this.localResultDices[2];
            this.labelKetQua.string = this.diemSo;
            this.updateShowResult();
          }
          if (cc.RedT.setting.taixiu_turbo.logs) {
            this.setPhienLabel(cc.RedT.setting.taixiu_turbo.logs[0].phien);
          }
        } else {
          this.resetUI();
          this.localResultDices = [];
          if (cc.RedT.setting.taixiu_turbo.logs) {
            this.setPhienLabel(cc.RedT.setting.taixiu_turbo.logs[0].phien + 1);
          }
          if (cc.RedT.setting.taixiu_turbo.time_remain === Constants.betTime) {
            this.reset();
          }

          if (cc.RedT.setting.taixiu_turbo.time_remain > Constants.minBetTime) {
            var time = helper.numberPad(
              cc.RedT.setting.taixiu_turbo.time_remain - 1,
              2
            );
            this.AnimatedTime.setTime(time);
            this.spriteNan.node.active = this.AnimatedTime.node.active = !self.isUM;
          } else clearInterval(this.timeInterval);
        }
        cc.RedT.setting.taixiu_turbo.time_remain--;
      }.bind(this),
      1000
    );
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
  dataLogs: function () {
    if (!!cc.RedT.setting.taixiu_turbo.logs.length) {
      var self = this;
      //Main log
      Promise.all(
        this.dotLogs.map(function (dot, index) {
          var data = cc.RedT.setting.taixiu_turbo.logs[index];
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

    var sliced = cc.RedT.setting.taixiu_turbo.logs.slice(0, 19);
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
      var data = cc.RedT.setting.taixiu_turbo.logs[index];
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
    var newArr = cc.RedT.setting.taixiu_turbo.logs.slice();
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
  reset: function () {
    this.isNan && this.dataLogs();
    cc.RedT.setting.taixiu_turbo.data.chanle.red_chan = cc.RedT.setting.taixiu_turbo.data.chanle.red_le = cc.RedT.setting.taixiu_turbo.data.chanle.red_me_chan = cc.RedT.setting.taixiu_turbo.data.chanle.red_me_le = cc.RedT.setting.taixiu_turbo.data.chanle.red_player_chan = cc.RedT.setting.taixiu_turbo.data.chanle.red_player_le = cc.RedT.setting.taixiu_turbo.data.chanle.xu_chan = cc.RedT.setting.taixiu_turbo.data.chanle.xu_le = cc.RedT.setting.taixiu_turbo.data.chanle.xu_me_chan = cc.RedT.setting.taixiu_turbo.data.chanle.xu_me_le = cc.RedT.setting.taixiu_turbo.data.chanle.xu_player_chan = cc.RedT.setting.taixiu_turbo.data.chanle.xu_player_le = cc.RedT.setting.taixiu_turbo.data.taixiu.red_me_tai = cc.RedT.setting.taixiu_turbo.data.taixiu.red_me_xiu = cc.RedT.setting.taixiu_turbo.data.taixiu.red_player_tai = cc.RedT.setting.taixiu_turbo.data.taixiu.red_player_xiu = cc.RedT.setting.taixiu_turbo.data.taixiu.red_tai = cc.RedT.setting.taixiu_turbo.data.taixiu.red_xiu = cc.RedT.setting.taixiu_turbo.data.taixiu.xu_me_tai = cc.RedT.setting.taixiu_turbo.data.taixiu.xu_me_xiu = cc.RedT.setting.taixiu_turbo.data.taixiu.xu_player_tai = cc.RedT.setting.taixiu_turbo.data.taixiu.xu_player_xiu = cc.RedT.setting.taixiu_turbo.data.taixiu.xu_tai = cc.RedT.setting.taixiu_turbo.data.taixiu.xu_xiu = this.totalLeft.string = this.totalRight.string = this.myLeft.string = this.myRight.string = this.playerLeft.string = this.playerRight.string = 0;
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
        cc.RedT.send({ taixiu_turbo: { get_new: true } });
      }.bind(this),
      2e3
    );
  },
});
