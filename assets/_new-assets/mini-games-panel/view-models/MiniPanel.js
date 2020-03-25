var BigBabol = require("BigBabol"),
  BaCay = require("Mini3Cay"),
  CaoThap = require("CaoThap"),
  AngryBirds = require("AngryBirds"),
  TopHu = require("popupTopHu"),
  MegaJackpot = require("MegaJackpot");
var configs = require("Configs")

cc.Class({
  extends: cc.Component,

  properties: {
    minigame: {
      default: null,
      type: cc.Node
    },
    Dialog: cc.Node,
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
    PrefabNoHu: cc.Prefab,
    prefabBigWin: cc.Prefab,
    PrefabTaiXiu: cc.Prefab,
    PrefabBauCua: cc.Prefab,
    PrefabMiniPoker: cc.Prefab,
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
    this.TopHu.init(this);

    var taiXiuPrefab = cc.instantiate(this.PrefabTaiXiu);
    this.TaiXiu = taiXiuPrefab.getComponent("TX");
    this.TaiXiu.init(this);

    var bauCuaPrefab = cc.instantiate(this.PrefabBauCua);
    this.BauCua = bauCuaPrefab.getComponent("BauCuaMini");
    this.BauCua.init(this);

    var miniPoker = cc.instantiate(this.PrefabMiniPoker);
    this.MiniPoker = miniPoker.getComponent("MiniPoker");
    this.MiniPoker.init(this);

    if (cc.RedT.IS_LOGIN) {
      this.signIn();
    }
    if (cc.RedT.setting.light != this.light) {
      this.changeLight();
    }
  },
  changeLight: function () {
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
    if (void 0 !== data.baucua) {
      this.BauCua.onData(data.baucua);
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
  },
  playClick: function () {
    cc.RedT.audio.playClick();
  },
  playUnClick: function () {
    cc.RedT.audio.playUnClick();
  },
  openGame(id) {
    console.log('opengame: ' + id);
    console.log(configs.gameIds);

    if (id == configs.gameIds.TaiXiu) {
      this.openTaiXiu();
    }
    else if (id == configs.gameIds.BauCua) {
      this.openBauCua();
    }
  },
  openTaiXiu: function () {
    this.TaiXiu.openGame();
    this.minigame.insertChild(this.TaiXiu.node);
  },
  openBauCua: function () {
    this.minigame.insertChild(this.BauCua.node);
    this.BauCua.node.active = false;
    this.BauCua.openGame();
  },
  openMiniPoker: function () {
    this.MiniPoker.openGame();
    this.minigame.insertChild(this.MiniPoker.node);
  },
});
