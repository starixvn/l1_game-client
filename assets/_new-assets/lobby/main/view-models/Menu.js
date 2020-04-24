cc.Class({
  extends: cc.Component,

  properties: {
    header: cc.Node,
    games: cc.Node,
    adsContent: cc.PageView,
    adsTimeNext: 0
  },
  onLoad() {
    Promise.all(
      this.games.children.map(function (obj) {
        return obj.getComponent("iconGame");
      })
    ).then(result => {
      this.games = result;
    });
    this.node._onPreDestroy = function () {
      clearTimeout(this.adsTime);
    }.bind(this);
  },

  eventStart: function () {
    clearTimeout(this.adsTime);
  },

  onHeadSelect: function (e) {
    Promise.all(
      this.header.children.map(function (obj) {
        if (obj == e.target) {
          obj.children[0].active = false;
          obj.pauseSystemEvents();
        } else {
          obj.children[0].active = true;
          obj.resumeSystemEvents();
        }
      })
    );
    Promise.all(
      this.games.map(function (game) {
        if (e.target.name == "all" || game[e.target.name]) {
          game.node.active = true;
        } else {
          game.node.active = false;
        }
      })
    );
  },
  loadGameRoom: function (name) {
    cc.director.loadScene(name);
  },
  openGame: function (e, name) {
    cc.RedT.audio.playClick();
    if (cc.RedT.IS_LOGIN) {
      cc.RedT.inGame.loading.active = true;
      cc.RedT.send({ g: { reg: name } });
    } else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  },
  openTaiXiu: function () {
    cc.RedT.MiniPanel.openTaiXiu();
  },
  openBauCua: function () {
    cc.RedT.MiniPanel.openBauCua();
  },
  openRongHo: function () {
    cc.RedT.MiniPanel.openRongHo();
  },
  openMiniPoker: function () {
    cc.RedT.MiniPanel.openMiniPoker();
  },
  openTaiXiuTurbo: function () {
    cc.RedT.MiniPanel.openTaiXiuTurbo();
  },
  openChanLe: function () {
    cc.RedT.MiniPanel.openChanLe();
  },
  openChanLeTurbo: function () {
    cc.RedT.MiniPanel.openChanLeTurbo();
  },
});
