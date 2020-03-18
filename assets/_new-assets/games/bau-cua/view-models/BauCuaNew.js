var helper = require("Helper");
var BauCua_linhVat = require("BauCuaMascot");
var BCConstants = require("BCConstants");

cc.Class({
  extends: cc.Component,

  properties: {
    background: cc.Node,
    linhVat: {
      default: [],
      type: BauCua_linhVat
    },

    iconMini: {
      default: [],
      type: cc.SpriteFrame
    },

    iconLV: {
      default: [],
      type: cc.SpriteFrame
    },

    dices: {
      default: [],
      type: cc.Sprite
    },

    logHuou: cc.Label,
    logBau: cc.Label,
    logGa: cc.Label,
    logCa: cc.Label,
    logCua: cc.Label,
    logTom: cc.Label,
    titleTime: cc.Label,
    animatedTime: cc.Component,
    waitedTime: cc.Label,
    labelHu: cc.Label,

    Animation: cc.Animation,

    bet: cc.Node,
    nodeRed: cc.Node,
    nodeXu: cc.Node,
    logs: cc.Node,
    prefabLogs: cc.Prefab,

    notice: cc.Node,
    prefabNotice: cc.Prefab,

    currentCuoc: 0,
    cuoc: "",
    red: true,
    topDialog: cc.Prefab,
    historyDialog: cc.Prefab,
    guidePrefab: cc.Prefab,
  },
  init(obj) {
    this.currentCuoc = 0;
    this.RedT = obj;
    cc.RedT.setting.baucua = cc.RedT.setting.baucua || {
      regOpen: false,
      data: {
        meXuBau: 0,
        meXuCa: 0,
        meXuCua: 0,
        meXuGa: 0,
        meXuHuou: 0,
        meXuTom: 0,
        meRedBau: 0,
        meRedCa: 0,
        meRedCua: 0,
        meRedGa: 0,
        meRedHuou: 0,
        meRedTom: 0,
        redBau: 0,
        redCa: 0,
        redCua: 0,
        redGa: 0,
        redHuou: 0,
        redTom: 0,
        xuBau: 0,
        xuCa: 0,
        xuCua: 0,
        xuGa: 0,
        xuHuou: 0,
        xuTom: 0
      },
      logLV: {},
      red: true,
      bet: "1"
    };

    var check = localStorage.getItem("bauCua");
    if (check == "true") {
      this.node.active = true;
    }

    if (void 0 !== cc.RedT.setting.baucua.position) {
      this.node.position = cc.RedT.setting.baucua.position;
    }
    if (void 0 !== cc.RedT.setting.baucua.time_remain) {
      cc.RedT.setting.baucua.time_remain++;
      this.nextRealTime();
    }
    if (cc.RedT.IS_LOGIN) {
      this.DataHandling(cc.RedT.setting.baucua.data);
      if (this.red != cc.RedT.setting.baucua.red) {
        this.changerCoint();
      }

      if (void 0 !== cc.RedT.setting.baucua.logs) {
        this.addLogs();
      }
      this.intChangerBet();
    }

    this.Animation.on("finished", this.AnimationFinish, this);
  },
  onLoad() {
    this.ttOffset = null;
    this.animatedTime.setRedTime(BCConstants.stopBetTime);
  },
  onEnable: function () {
    //this.onGetHu();
    this.regEvent(true);
    this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
    this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    this.background.on(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
  },
  onDisable: function () {
    this.regEvent(false);
    this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    this.background.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
    this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    this.background.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
    //this.onCloseGame();
  },
  regEvent: function (bool) {
    cc.RedT.send({
      g: {
        baucua: !cc.RedT.setting.baucua.regOpen ? {
          view: bool,
          regOpen: true
        } : {
            view: bool
          }
      }
    });
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
    cc.RedT.setting.baucua.position = this.node.position;
  },
  openGame: function () {
    cc.RedT.audio.playClick();
    if (cc.RedT.IS_LOGIN) {
      this.node.active = !0;
      localStorage.setItem("bauCua", true);
      // this.setTop();
    } else cc.RedT.inGame.dialog.showSignIn();
  },
  closeGame: function () {
    cc.RedT.audio.playUnClick();
    this.node.active = !1;
    localStorage.setItem("bauCua", false);
  },
  pressedTopDialog() {
    var dialog = cc.instantiate(this.topDialog);
    this.node.addChild(dialog);
    this.Top = dialog.getComponent("BauCuaTop");
    this.Top.init(this);
  },
  pressedHistoryDialog() {
    var dialog = cc.instantiate(this.historyDialog);
    this.node.addChild(dialog);
    this.LichSu = dialog.getComponent("BauCuaHistory");
    this.LichSu.init(this);
  },
  pressedShowGuide() {
    var dialog = cc.instantiate(this.guidePrefab);
    this.node.addChild(dialog);
    var guide = dialog.getComponent("dialogHuongDan");
    guide.select("BauCua");
  },
  setTop: function () {
    this.node.parent.insertChild(this.node);
  },
  changerCoint: function () {
    this.red = !this.red;
    this.nodeRed.active = !this.nodeRed.active;
    this.nodeXu.active = !this.nodeXu.active;
    cc.RedT.setting.baucua.regOpen &&
      this.DataHandling(cc.RedT.setting.baucua.data);
    cc.RedT.setting.baucua.red = this.red;
    //this.onGetHu();
  },
  intChangerBet: function () {
    var self = this;
    Promise.all(
      this.bet.children.map(function (obj) {
        if (obj.name == cc.RedT.setting.baucua.bet) {
          self.cuoc = obj.name;
          obj.children[0].active = true;
          obj.pauseSystemEvents();
        } else {
          obj.children[0].active = false;
          obj.resumeSystemEvents();
        }
      })
    );
  },
  changerBet: function (event, bet) {
    this.cuoc = bet;
    var target = event.target;
    // Promise.all(
    this.bet.children.map(function (obj) {
      if (obj == target) {
        obj.children[0].active = true;
        obj.zIndex = 2;
        cc.tween(obj)
          .to(0.2, {
            scale: 1.15,
            position: cc.v2(obj.position.x, 12)
          })
          .start();
        obj.pauseSystemEvents();
      } else {
        obj.children[0].active = false;
        obj.zIndex = 1;
        cc.tween(obj)
          .to(0.2, {
            scale: 1,
            position: cc.v2(obj.position.x, 0)
          })
          .start();
        obj.resumeSystemEvents();
      }
    })
    // );
    cc.RedT.setting.baucua.bet = target.name;
    //this.onGetHu();
  },
  AnimationFinish: function () {
    this.addLogs();
    var dice = cc.RedT.setting.baucua.logs[0];
    var heSo = {};
    for (var i = 0; i < 3; i++) {
      var dataT = dice[i];
      if (void 0 === heSo[dataT]) {
        heSo[dataT] = 1;
      } else {
        heSo[dataT] += 1;
      }
    }
    for (var j = 0; j < 6; j++) {
      if (void 0 !== heSo[j]) {
        this.linhVat[j].Select(heSo[j]);
      }
    }
  },
  datCuoc: function (e, linhVat) {
    var cuoc = parseInt(this.cuoc);
    if (this.currentCuoc + cuoc > 100) {
      this.addNotice("Không thể cược hơn 100 !!! ");
    } else {
      this.currentCuoc = cuoc + this.currentCuoc;

      cc.RedT.send({
        g: {
          baucua: {
            cuoc: {
              cuoc: this.cuoc,
              red: this.red,
              linhVat: linhVat
            }
          }
        }
      });
    }
  },
  addNotice: function (text) {
    var notice = cc.instantiate(this.prefabNotice);
    var noticeComponent = notice.getComponent("mini_warning");
    noticeComponent.text.string = text;
    this.notice.addChild(notice);
  },
  setDice: function (dices) {
    var self = this;
    Promise.all(
      dices.map(function (dice, index) {
        self.dices[index].spriteFrame = self.iconLV[dice];
      })
    );
  },
  addLogs: function () {
    var self = this;
    this.logs.removeAllChildren();
    var limitLog = 30;
    var count = Math.min(limitLog, cc.RedT.setting.baucua.logs.length);
    var LinhVat = [0, 0, 0, 0, 0, 0];
    for (var index = 0; index < count; index++) {
      var log = cc.RedT.setting.baucua.logs[index];
      LinhVat[log[0]] += 1;
      LinhVat[log[1]] += 1;
      LinhVat[log[2]] += 1;
      var node = cc.instantiate(self.prefabLogs);
      var nodeComponent = node.getComponent("BauCua_logMini");
      Promise.all(
        nodeComponent.icon.map(function (sp, i) {
          sp.spriteFrame = self.iconMini[log[i]];
        })
      );
      if (index == 0) {
        node.children[3].active = true;
      }
      self.logs.addChild(node);
    }

    this.logLVHandling(LinhVat);
  },
  onData: function (data) {
    if (void 0 !== data.data) {
      var a = Object.assign(cc.RedT.setting.baucua.data, data.data);
      this.DataHandling(data.data);
    }
    if (void 0 !== data.status) {
      this.status(data.status);
    }
    if (void 0 !== data.logs) {
      cc.RedT.setting.baucua.logs = data.logs;
      this.addLogs();
    }
    if (void 0 !== data.tops) {
      this.Top && this.Top.onData(data.tops);
    }
    if (void 0 !== data.viewlogs) {
      this.LichSu && this.LichSu.onData(data.viewlogs);
    }
    if (void 0 !== data.regOpen) {
      cc.RedT.setting.baucua.regOpen = true;
    }
    if (void 0 !== data.time_remain) {
      cc.RedT.setting.baucua.time_remain = data.time_remain;
      this.playTime();
    }
    if (void 0 !== data.finish) {
      if (cc.RedT.setting.baucua.regOpen) {
        this.unSelect();
        // Huỷ đếm
        void 0 !== this.timeInterval && clearInterval(this.timeInterval);
        // Thêm kết quả
        cc.RedT.setting.baucua.logs.unshift([
          data.finish.dices[0],
          data.finish.dices[1],
          data.finish.dices[2]
        ]);
        cc.RedT.setting.baucua.logs.length > 15 &&
          cc.RedT.setting.baucua.logs.pop();
        this.setDice(data.finish.dices);
        // Play
        this.Animation.node.active = true;
        this.Animation.play();
        cc.tween(this.node)
          .delay(1)
          .call(() => {
            this.showWinSlot(data.finish.dices);
          })
          .start();
      }

      cc.RedT.setting.baucua.time_remain = BCConstants.betTime + BCConstants.timeToNext + 2;
      this.playTime();
    }
    if (void 0 !== data.notice) {
      this.addNotice(data.notice);
    }
  },
  resetAllSlot: function () {
    for (var i = 0; i < this.linhVat.length; ++i) {
      this.linhVat[i].resetState();
      this.linhVat[i].clearCuoc();
    }
  },
  showWinSlot: function (dices) {
    for (var i = 0; i < this.linhVat.length; ++i) {
      this.linhVat[i].updateState(false);
    }
    dices.forEach(i => {
      this.linhVat[i].updateState(true);
    });
  },
  playTime: function () {
    void 0 !== this.timeInterval && clearInterval(this.timeInterval);
    this.timeInterval = setInterval(
      function () {
        if (cc.RedT.setting.baucua.time_remain > (BCConstants.betTime + 1)) {
          //count down to next round
          let time = helper.numberPad(
            cc.RedT.setting.baucua.time_remain - (BCConstants.betTime + 2),
            2
          );
          // this.animatedTime.setTime(time, true);
          this.waitedTime.string = time == "00" ? '' : "00:" + time;
          this.waitedTime.node.parent.active = true && time != "00";

          this.titleTime.string = "Xem phiên";
          // if (cc.RedT.setting.baucua.time_remain < (BCConstants.betTime + 6)) {
          // show countdown           
          // this.Animation.node.active = false;
          // }
        } else {
          this.Animation.node.active = false;
          if (
            cc.RedT.setting.baucua.regOpen &&
            cc.RedT.setting.baucua.time_remain == (BCConstants.betTime + 1)
          ) {
            this.waitedTime.node.parent.active = false;
            this.Animation.node.active = false;
            this.resetData();
          }

          this.titleTime.string = "Đặt cược";
          if (cc.RedT.setting.baucua.time_remain > 1) {
            let time = helper.numberPad(
              cc.RedT.setting.baucua.time_remain - 1,
              2
            );

            this.animatedTime.setTime(time);

          } else clearInterval(this.timeInterval);
        }
        cc.RedT.setting.baucua.time_remain--;
      }.bind(this),
      1000
    );
  },
  nextRealTime: function () {
    if (cc.RedT.setting.baucua.time_remain > (BCConstants.betTime + 1)) {
      var time = helper.numberPad(cc.RedT.setting.baucua.time_remain - (BCConstants.betTime + 2), 2);
      this.animatedTime.setTime(helper.numberPad(time, 2), true);
      this.titleTime.string = "Xem phiên";
    } else {
      this.titleTime.string = "Đặt cược";
      if (cc.RedT.setting.baucua.time_remain > 0) {
        var time = helper.numberPad(cc.RedT.setting.baucua.time_remain - 1, 2);
        this.animatedTime.setTime(time);
      }
    }
  },
  logLVHandling: function (data) {
    this.logHuou.string = helper.numberWithCommas(data[0]);
    this.logBau.string = helper.numberWithCommas(data[1]);
    this.logGa.string = helper.numberWithCommas(data[2]);
    this.logCa.string = helper.numberWithCommas(data[3]);
    this.logCua.string = helper.numberWithCommas(data[4]);
    this.logTom.string = helper.numberWithCommas(data[5]);
  },
  DataHandling: function (data) {
    if (this.red) {
      if (void 0 !== data.redHuou) {
        this.linhVat[0].totallCuoc(data.redHuou);
      }
      if (void 0 !== data.redBau) {
        this.linhVat[1].totallCuoc(data.redBau);
      }
      if (void 0 !== data.redGa) {
        this.linhVat[2].totallCuoc(data.redGa);
      }
      if (void 0 !== data.redCa) {
        this.linhVat[3].totallCuoc(data.redCa);
      }
      if (void 0 !== data.redCua) {
        this.linhVat[4].totallCuoc(data.redCua);
      }
      if (void 0 !== data.redTom) {
        this.linhVat[5].totallCuoc(data.redTom);
      }

      if (void 0 !== data.meRedHuou) {
        this.linhVat[0].meCuoc(data.meRedHuou);
      }
      if (void 0 !== data.meRedBau) {
        this.linhVat[1].meCuoc(data.meRedBau);
      }
      if (void 0 !== data.meRedGa) {
        this.linhVat[2].meCuoc(data.meRedGa);
      }
      if (void 0 !== data.meRedCa) {
        this.linhVat[3].meCuoc(data.meRedCa);
      }
      if (void 0 !== data.meRedCua) {
        this.linhVat[4].meCuoc(data.meRedCua);
      }
      if (void 0 !== data.meRedTom) {
        this.linhVat[5].meCuoc(data.meRedTom);
      }
    } else {
      if (void 0 !== data.xuHuou) {
        this.linhVat[0].totallCuoc(data.xuHuou);
      }
      if (void 0 !== data.xuBau) {
        this.linhVat[1].totallCuoc(data.xuBau);
      }
      if (void 0 !== data.xuGa) {
        this.linhVat[2].totallCuoc(data.xuGa);
      }
      if (void 0 !== data.xuCa) {
        this.linhVat[3].totallCuoc(data.xuCa);
      }
      if (void 0 !== data.xuCua) {
        this.linhVat[4].totallCuoc(data.xuCua);
      }
      if (void 0 !== data.xuTom) {
        this.linhVat[5].totallCuoc(data.xuTom);
      }

      if (void 0 !== data.meXuHuou) {
        this.linhVat[0].meCuoc(data.meXuHuou);
      }
      if (void 0 !== data.meXuBau) {
        this.linhVat[1].meCuoc(data.meXuBau);
      }
      if (void 0 !== data.meXuGa) {
        this.linhVat[2].meCuoc(data.meXuGa);
      }
      if (void 0 !== data.meXuCa) {
        this.linhVat[3].meCuoc(data.meXuCa);
      }
      if (void 0 !== data.meXuCua) {
        this.linhVat[4].meCuoc(data.meXuCua);
      }
      if (void 0 !== data.meXuTom) {
        this.linhVat[5].meCuoc(data.meXuTom);
      }
    }
  },
  unSelect: function () {
    Promise.all(
      this.linhVat.map(function (linhVat) {
        linhVat.unSelect();
      })
    );
  },
  resetData: function () {
    var data = Object.keys(cc.RedT.setting.baucua.data);
    Promise.all(
      data.map(function (key) {
        return (cc.RedT.setting.baucua.data[key] = 0);
      })
    ).then(result => {
      this.DataHandling(cc.RedT.setting.baucua.data);
    });

    this.unSelect();

    this.currentCuoc = 0;
    this.resetAllSlot();
  },
  newGame: function () {
    cc.RedT.setting.baucua.regOpen = false;
    void 0 !== this.timeInterval && clearInterval(this.timeInterval);
    //this.resetData.resetData();
  },
  status: function (data) {
    setTimeout(
      function () {
        var temp = new cc.Node();
        temp.addComponent(cc.Label);
        temp = temp.getComponent(cc.Label);
        temp.string =
          (data.win ? "+" : "-") + helper.numberWithCommas(data.bet);
        temp.font = data.win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 30;
        temp.node.position = cc.v2(0, 90);
        this.notice.addChild(temp.node);
        temp.node.runAction(
          cc.sequence(
            cc.moveTo(3.5, cc.v2(0, 200)),
            cc.callFunc(function () {
              this.node.destroy();
            }, temp)
          )
        );
        data.win && cc.RedT.send({
          user: {
            updateCoint: true
          }
        });
        if (void 0 !== data.thuong && data.thuong > 0) {
          var thuong = new cc.Node();
          thuong.addComponent(cc.Label);
          thuong = thuong.getComponent(cc.Label);
          thuong.string = "+" + helper.numberWithCommas(data.thuong);
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
      }.bind(this),
      2e3
    );
  }
});