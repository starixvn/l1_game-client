var TX_Main = require("TXMain");

cc.Class({
  extends: cc.Component,
  properties: {
    TX_Main: TX_Main,
    board: true,
    TX_StatsPrefab: cc.Prefab,
    TX_TopPrefab: cc.Prefab,
    TX_HistoryPrefab: cc.Prefab,
    TX_HistoryBetPrefab: cc.Prefab,
    GuidePrefab: cc.Prefab,
  },

  init(obj) {
    this.miniPanel = obj;
    cc.RedT.setting.taixiu = cc.RedT.setting.taixiu || { getLogs: false };
    cc.RedT.setting.taixiu.getLogs = false;
    this.TX_Main.init(this);
    var check = cc.sys.localStorage.getItem("taixiu");

    if (check == "true") {
      this.node.active = true;
    }
    var self = this;
    cc.game.on(cc.game.EVENT_HIDE, self.onGameHide, self);
    cc.game.on(cc.game.EVENT_SHOW, self.onGameShow, self);
  },
  onGameShow() {
    cc.RedT.send({
      taixiu: { get_time: true, getLogs: true }
    });
  },
  onGameHide() {
    this.TX_Main.onGameHide();
  },
  onSignIn() {
    if (!this.node.active) {
      return;
    }

    //force refresh
    cc.RedT.setting.taixiu.getLogs = false;
    this.regEvent(true);
  },
  onDestroy() {
    cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
    cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
  },
  onEnable: function () {
    this.regEvent(true);
  },
  onDisable: function () {
    this.regEvent(false);
    this.TX_Main.onGameHide();
    this.node.destroyAllChildren();
    this.node.destroy();
  },
  setTop: function () {
    this.node.parent.insertChild(this.node);
  },
  regEvent: function (bool) {
    cc.RedT.send({
      taixiu: !cc.RedT.setting.taixiu.getLogs
        ? { view: bool, getLogs: true, get_time: true }
        : { view: bool }
    });
  },
  openGame: function (e, taixiu = "1") {
    cc.RedT.audio.playClick();
    this.TX_Main.initGame(taixiu == "1");
    this.node.active = 1;
    cc.sys.localStorage.setItem("taixiu", true);
  },
  closeGame: function () {
    cc.RedT.audio.playUnClick();
    this.node.active = !1;
    cc.sys.localStorage.setItem("taixiu", false);
  },
  newGame: function () {
    this.TX_ThongKe.node.active = this.TX_Main.TX_Board.node.active = false;
    this.TX_Main.setDefautl();
  },
  signIn: function () {
    !this.node.active && (this.TX_Main.nodeTimePopup.active = true);
  },
  showTop: function () {
    cc.RedT.audio.playClick();

    var dialog = cc.instantiate(this.TX_TopPrefab);
    this.miniPanel.dialog.insertChild(dialog);
    this.TXTop = dialog.getComponent("TXTop");
    this.TXTop.init(this);
  },
  showStats: function () {
    cc.RedT.audio.playClick();

    var dialog = cc.instantiate(this.TX_StatsPrefab);
    this.miniPanel.dialog.insertChild(dialog);
    this.TXStats = dialog.getComponent("TXStats");
    this.TXStats.init(this);
  },
  showHistory: function () {
    cc.RedT.audio.playClick();

    var dialog = cc.instantiate(this.TX_HistoryPrefab);
    this.miniPanel.dialog.insertChild(dialog);
    this.TXHistory = dialog.getComponent("TXHistory");
    this.TXHistory.init(this);
  },
  showBetHistory: function (event) {
    cc.RedT.audio.playClick();

    var dialog = cc.instantiate(this.TX_HistoryBetPrefab);
    this.miniPanel.dialog.insertChild(dialog);
    this.TXBetHistory = dialog.getComponent("TXBetHistory");
    this.TXBetHistory.init(this);
    this.TXBetHistory.getPhien(event.target.phien)
  },
  showGuide: function () {
    cc.RedT.audio.playClick();

    var dialog = cc.instantiate(this.GuidePrefab);
    this.miniPanel.dialog.insertChild(dialog);
    var guide = dialog.getComponent("GameGuide");
    guide.select("TaiXiu");
  },
});
