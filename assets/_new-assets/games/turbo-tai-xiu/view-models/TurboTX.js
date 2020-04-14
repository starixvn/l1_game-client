var TX = require("TX");

cc.Class({
  extends: TX,

  init(obj) {
    this.miniPanel = obj;
    cc.RedT.setting.taixiu_turbo = cc.RedT.setting.taixiu_turbo || { getLogs: false };
    cc.RedT.setting.taixiu_turbo.getLogs = false;
    this.TX_Main.init(this);
    var check = cc.sys.localStorage.getItem("taixiu_turbo");

    if (check == "true") {
      this.node.active = true;
    }
    var self = this;
    cc.game.on(cc.game.EVENT_HIDE, self.onGameHide, self);
    cc.game.on(cc.game.EVENT_SHOW, self.onGameShow, self);
  },
  onGameShow() {
    cc.RedT.send({
      taixiu_turbo: { get_time: true, getLogs: true }
    });
  },
  regEvent: function (bool) {
    cc.RedT.send({
      taixiu_turbo: !cc.RedT.setting.taixiu_turbo.getLogs
        ? { view: bool, getLogs: true, get_time: true }
        : { view: bool }
    });
  },
  openGame: function (e, taixiu = "1") {
    cc.RedT.audio.playClick();
    this.TX_Main.initGame(taixiu == "1");
    this.node.active = 1;
    cc.sys.localStorage.setItem("taixiu_turbo", true);
  },
  closeGame: function () {
    cc.RedT.audio.playUnClick();
    this.node.active = !1;
    cc.sys.localStorage.setItem("taixiu_turbo", false);
  },
});
