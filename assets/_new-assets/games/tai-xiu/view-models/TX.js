var TX_Main = require("TXMain");
var Constants = require("./main-page/TXConstants");
const { constant } = require("lodash");

cc.Class({
  extends: cc.Component,
  properties: {
    TX_Main: TX_Main,
    board: true,
    TX_StatsPrefab: cc.Prefab,
    TX_TopPrefab: cc.Prefab,
    TX_HistoryPrefab: cc.Prefab,
    TX_HistoryBetPrefab: cc.Prefab,
    presetBetPrefab: cc.Prefab
  },


  init(gameName, obj) {
    this.gameName = gameName;
    this.miniPanel = obj;
    this.presetBet = null;
    this.presetBetSettingKey = Constants.presetBetSettingKey;
    cc.RedT.setting.taixiu = cc.RedT.setting.taixiu || { getLogs: false };
    cc.RedT.setting.taixiu.getLogs = false;

    this.TX_Main.init(this);

  },

  onLoad() {
    this.initPresetBetBoard();
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
    cc.RedT.setting.taixiu.getLogs = false;
    this.regEvent(true);
  },

  onEnable: function () {
    this.regEvent(true);
    var self = this;
    cc.game.on(cc.game.EVENT_HIDE, self.onGameHide, self);
    cc.game.on(cc.game.EVENT_SHOW, self.onGameShow, self);
    this.observeData();
  },

  onDisable: function () {
    this.regEvent(false);
    this.TX_Main.onGameHide();
    cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
    cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
    this.removeDataObserver();
  },
  setTop: function () {
    this.node.parent.insertChild(this.node);
  },
  regEvent: function (show) {
    if (show) {
      cc.RedT.send({
        taixiu: { view: true, getLogs: true, get_time: true }
      });
    }
    else {
      cc.RedT.send({
        taixiu: { view: false }
      });
    }
  },

  observeData() {
    cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
  },

  removeDataObserver() {
    cc.RedT.removeDataObserver(this.gameName);
  },

  receivedData(data) {
    if (data[this.gameName]) {
      this.TX_Main.onData(data[this.gameName]);
    }
  },

  openGame: function (e, taixiu = "1") {
    cc.RedT.audio.playClick();
    this.TX_Main.initGame(taixiu == "1");
    this.node.active = 1;
  },
  closeGame: function () {
    cc.RedT.audio.playUnClick();
    this.node.active = !1;
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
    this.showBetHistoryAtRound(event.target.phien);
  },
  showBetHistoryAtRound: function (phien) {
    var dialog = cc.instantiate(this.TX_HistoryBetPrefab);
    this.miniPanel.dialog.insertChild(dialog);
    this.TXBetHistory = dialog.getComponent("TXBetHistory");
    this.TXBetHistory.init(this);
    this.TXBetHistory.getPhien(phien);
  },
  showGuide: function () {
    cc.RedT.audio.playClick();
    this.miniPanel.openGuide("TaiXiu");
  },

  initPresetBetBoard() {
    const node = cc.instantiate(this.presetBetPrefab);
    this.presetBet = node.getComponent("PresetBet");
    this.presetBet.onChangedBet = (betAmount) => { this.changedPresetBet(betAmount); }
    this.presetBet.getPreset = () => this.TX_Main.presetBetValue;
    this.TX_Main.node.addChild(node);
    this.presetBet.close();

    this.TX_Main.presetBetValue = parseFloat(cc.sys.localStorage.getItem(this.presetBetSettingKey)) || 0;
  },

  changedPresetBet(value) {
    this.TX_Main.presetBetValue = value;
    cc.sys.localStorage.setItem(this.presetBetSettingKey, this.TX_Main.presetBetValue);
  },

  openPresetBetDialog() {
    cc.RedT.audio.playClick();
    this.presetBet.toggle();
  }
});
