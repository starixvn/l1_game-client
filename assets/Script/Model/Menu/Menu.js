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
      this.games.children.map(function(obj) {
        return obj.getComponent("iconGame");
      })
    ).then(result => {
      this.games = result;
    });
    this.node._onPreDestroy = function() {
      clearTimeout(this.adsTime);
    }.bind(this);
  },
  onEnable: function() {},
  onDisable: function() {},

  eventStart: function() {
    clearTimeout(this.adsTime);
  },

  onHeadSelect: function(e) {
    Promise.all(
      this.header.children.map(function(obj) {
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
      this.games.map(function(game) {
        if (e.target.name == "all" || game[e.target.name]) {
          game.node.active = true;
        } else {
          game.node.active = false;
        }
      })
    );
  },
  openMiniGame: function(e, name) {
    if (name == "TaiXiu") {
      cc.RedT.MiniPanel.openGame(name);
    } else {
      cc.RedT.MiniPanel[name].openGame();
    }
  },
  regGame: function(e, name) {
    cc.RedT.audio.playClick();
    if (cc.RedT.IS_LOGIN) {
      cc.RedT.inGame.loading.active = true;
      cc.RedT.send({ g: { reg: name } });
    } else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  },
  openGame: function(e, name) {
    cc.RedT.audio.playClick();
    if (cc.RedT.IS_LOGIN) {
      cc.RedT.inGame.loading.active = true;
      cc.director.loadScene(name);
    } else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  },
  openTXCL: function(e, taixiu) {
    // Open Tài Xỉu | Chẵn Lẻ
    cc.RedT.MiniPanel.TaiXiu.openGame(null, taixiu);
  }
});
