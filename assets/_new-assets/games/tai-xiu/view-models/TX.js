var TX_Main = require("TXMain"),
  TX_ThongKe = require("TXStats"),
  TX_Top = require("TXTop");

cc.Class({
  extends: cc.Component,
  properties: {
    TX_Main: TX_Main,
    TX_ThongKe: TX_ThongKe,
    TX_Top: TX_Top,
    board: true,
    TX_HistoryPrefab: cc.Prefab,
    TX_HistoryBetPrefab: cc.Prefab,
    GuidePrefab: cc.Prefab,
  },

  init(obj) {
    this.miniPanel = obj;
    cc.RedT.setting.taixiu = cc.RedT.setting.taixiu || { getLogs: false };
    this.TX_Main.init(this);
    this.TX_ThongKe.init(this);
    this.TX_Top.init(this);
    var check = localStorage.getItem("taixiu");

    if (check == "true") {
      this.node.active = true;
    }
  },
  onEnable: function () {
    this.regEvent(true);
  },
  onDisable: function () {
    this.regEvent(false);
  },
  setTop: function () {
    this.node.parent.insertChild(this.node);
  },
  regEvent: function (bool) {
    cc.RedT.send({
      taixiu: !cc.RedT.setting.taixiu.getLogs
        ? { view: bool, getLogs: true }
        : { view: bool }
    });
  },
  openGame: function (e, taixiu = "1") {
    cc.RedT.audio.playClick();

    if (cc.RedT.IS_LOGIN) {
      this.TX_Main.initGame(taixiu == "1");
      this.node.active = 1;
      localStorage.setItem("taixiu", true);
    } else cc.RedT.inGame.dialog.showSignIn();
  },
  closeGame: function () {
    cc.RedT.audio.playUnClick();
    this.node.active = this.TX_Top.node.active = this.TX_ThongKe.node.active = this.TX_Main.TX_Board.node.active = !1;
    localStorage.setItem("taixiu", false);
  },
  newGame: function () {
    this.TX_ThongKe.node.active = this.TX_Main.TX_Board.node.active = false;
    this.TX_Main.setDefautl();
  },
  signIn: function () {
    !this.node.active && (this.TX_Main.nodeTimePopup.active = true);
  },
  showHistory: function () {
    var taiXiuHistoryPrefab = cc.instantiate(this.TX_HistoryPrefab);
    this.miniPanel.Dialog.insertChild(taiXiuHistoryPrefab);
    this.TXHistory = taiXiuHistoryPrefab.getComponent("TXHistory");
    this.TXHistory.init(this);
  },
  showBetHistory: function (event) {
    var taiXiuBetHistoryPrefab = cc.instantiate(this.TX_HistoryBetPrefab);
    this.miniPanel.Dialog.insertChild(taiXiuBetHistoryPrefab);
    this.TXBetHistory = taiXiuBetHistoryPrefab.getComponent("TXBetHistory");
    this.TXBetHistory.init(this);
    this.TXBetHistory.getPhien(event.target.phien)
  },
  showGuide: function () {
    var dialog = cc.instantiate(this.GuidePrefab);
    this.miniPanel.Dialog.insertChild(dialog);
    var guide = dialog.getComponent("dialogHuongDan");
    guide.select("TaiXiu");
  },
});
