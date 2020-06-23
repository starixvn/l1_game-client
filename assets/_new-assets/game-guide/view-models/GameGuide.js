
cc.Class({
    extends: cc.Component,

    properties: {
        game: cc.Node,
        content: cc.Node,
        title: cc.Label,

        bauCuaOddOne: cc.Label,
        bauCuaOddTwo: cc.Label,
        bauCuaOddThree: cc.Label,
    },
    onLoad() {
        cc.RedT.send({
            g: {
                baucua: {
                    get_odd: true
                }
            }
        });

        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
    },
    selectGame: function (event, game) {
        this.select(game);
    },
    select: function (game) {
        cc.RedT.audio.playClick();
        var self = this;
        Promise.all(this.game.children.map(function (obj) {
            //var parent = obj.node.parent;
            if (obj.name == game) {
                obj.children[0].active = true;
                obj.pauseSystemEvents();
                self.title.string = obj.children[1].getComponent(cc.Label).string;
            } else {
                obj.children[0].active = false;
                obj.resumeSystemEvents();
            }
            return void 0;
        }))

        Promise.all(this.content.children.map(function (obj) {
            if (obj.name == game) {
                obj.active = true;
            } else {
                obj.active = false;
            }
            return void 0;
        }))
    },
    closeDialog: function () {
        this.node.active = false;
    },
    onData(data) {
        if (void 0 !== data.baucua.odds) {
            var odds = data.baucua.odds;
            this.updateBauCuaOddLabels(odds)
        }
    },
    updateBauCuaOddLabels: function (odds) {
        if (odds.length < 3) {
            this.bauCuaOddOne.string = ``;
            this.bauCuaOddTwo.string = ``;
            this.bauCuaOddThree.string = ``;
            return;
        }
        this.bauCuaOddOne.string = odds[0];
        this.bauCuaOddTwo.string = odds[1];
        this.bauCuaOddThree.string = odds[2];
    },
});
