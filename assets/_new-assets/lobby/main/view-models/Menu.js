
cc.Class({
  extends: cc.Component,

  properties: {
    header: cc.Node,
    games: cc.Node,
    adsContent: cc.PageView,
    adsTimeNext: 0,
  },
  onLoad() {
    Promise.all(
      this.games.children.map(function (obj) {
        return obj.getComponent('iconGame');
      })
    ).then((result) => {
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
        if (e.target.name == 'all' || game[e.target.name]) {
          game.node.active = true;
        } else {
          game.node.active = false;
        }
      })
    );
  },
  openGameRoom: function (e, id) {
    cc.RedT.audio.playClick();
    cc.RedT.MiniPanel.openGameRoom(e, id);
  },
  openGameMini: function (e, id) {
    cc.RedT.audio.playClick();
    cc.RedT.MiniPanel.openGame(e, id);
  },
  openNewGameSocket: function (e, gameId) {
    cc.RedT.audio.playClick();
    cc.RedT.MiniPanel.openNewGameSocket(e, gameId);
  }
});
