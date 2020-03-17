var MiniPoker = require("MiniPoker"),
  BigBabol = require("BigBabol"),
  BaCay = require("Mini3Cay"),
  CaoThap = require("CaoThap"),
  AngryBirds = require("AngryBirds"),
  TopHu = require("popupTopHu"),
  Dialog = require("MiniDialog");

var MegaJackpot = require("MegaJackpot");

cc.Class({
  extends: cc.Component,

  properties: {
    minigame: {
      default: null,
      type: cc.Node
    },
    Dialog: Dialog,
    MiniPoker: MiniPoker,
    BigBabol: BigBabol,
    BaCay: BaCay,
    CaoThap: CaoThap,
    AngryBirds: AngryBirds,
    MegaJackpot: MegaJackpot,

    TopHu: TopHu,

    bgLight: cc.Node,
    spriteLight: cc.Sprite,
    onLight: cc.SpriteFrame,
    offLight: cc.SpriteFrame,

    nodeEfect: cc.Node,
    // Prefab
    PrefabNoHu: cc.Prefab, // TODO
    prefabBigWin: cc.Prefab, // TODO
    PrefabTaiXiu: cc.Prefab,
    PrefabBauCua: cc.Prefab,
    light: true
  },
  onLoad() {
    if (void 0 === cc.RedT.setting.light) {
      cc.RedT.setting.light = true;
    }
    var self = this;
    this.node._onPreDestroy = function () {
      self.onDestroy();
    };
    this.Dialog.init(this);
    this.MiniPoker.init(this);
    // this.BigBabol.init(this);
    // this.BaCay.init(this);
    // this.CaoThap.init(this);
    // this.AngryBirds.init(this);
    // this.MegaJackpot.init(this);
    this.TopHu.init(this);

    var taiXiuPrefab = cc.instantiate(this.PrefabTaiXiu);
    this.TaiXiu = taiXiuPrefab.getComponent("TX");
    this.TaiXiu.init(this);

    var bauCuaPrefab = cc.instantiate(this.PrefabBauCua);
    this.BauCua = bauCuaPrefab.getComponent("BauCuaNew");
    this.BauCua.init(this);

    if (cc.RedT.IS_LOGIN) {
      this.signIn();
    }
    if (cc.RedT.setting.light != this.light) {
      this.LightChanger();
    }
  },
  openGame: function (name) {
    if (name == "TaiXiu") {
      this.TaiXiu.openGame();
      this.minigame.insertChild(this.TaiXiu.node);
    }

    if (name == "BauCua") {
      this.BauCua.openGame();
      this.minigame.insertChild(this.BauCua.node);
    }
  },
  LightChanger: function () {
    this.light = cc.RedT.setting.light = !this.light;
    if (this.light) {
      this.bgLight.active = false;
      this.spriteLight.spriteFrame = this.offLight;
    } else {
      this.bgLight.active = true;
      this.spriteLight.spriteFrame = this.onLight;
    }
  },
  signIn: function () {
    this.minigame.active = true;
  },
  newGame: function () {
    this.minigame.active = false;
  },
  onData: function (data) {
    if (void 0 !== data.poker) {
      this.MiniPoker.onData(data.poker);
    }
    if (void 0 !== data.big_babol) {
      this.BigBabol.onData(data.big_babol);
    }
    if (void 0 !== data.baucua) {
      this.BauCua.onData(data.baucua);
    }
    if (void 0 !== data.bacay) {
      this.BaCay.onData(data.bacay);
    }
    if (void 0 !== data.caothap) {
      this.CaoThap.onData(data.caothap);
    }
    if (void 0 !== data.arb) {
      this.AngryBirds.onData(data.arb);
    }
    if (void 0 !== data.megaj) {
      this.MegaJackpot.onData(data.megaj);
    }
  },
  onDataTaiXiu: function (taiXiuData) {
    if (void 0 !== taiXiuData) {
      this.TaiXiu.TX_Main.onData(taiXiuData);
    }
  },
  onDestroy: function () {
    clearInterval(this.TaiXiu.TX_Main.timeInterval);
    clearInterval(this.BauCua.timeInterval);
    void 0 !== this.CaoThap.timeInterval &&
      clearInterval(this.CaoThap.timeInterval);
  },
  playClick: function () {
    cc.RedT.audio.playClick();
  },
  playUnClick: function () {
    cc.RedT.audio.playUnClick();
  }
});
