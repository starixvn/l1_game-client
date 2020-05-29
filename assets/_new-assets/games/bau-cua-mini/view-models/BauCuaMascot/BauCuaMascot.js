var helper = require('Helper');

cc.Class({
    extends: cc.Component,
    properties: {
        xSprite: cc.Sprite,
        totall: cc.Label,
        me: cc.Label,
        x2Sprite: cc.SpriteFrame,
        x3Sprite: cc.SpriteFrame,
    },

    onLoad() {
        this.lastTotalCuoc = 0;
    },

    meCuoc: function (cuoc) {
        if (!!cuoc) {
            this.me.string = helper.numberWithCommas(cuoc);
        }
    },
    totallCuoc: function (cuoc) {
        if (!!cuoc && cuoc != "0") {
            helper.numberTo(this.totall, this.lastTotalCuoc, cuoc, 0, true);
            //this.totall.string = helper.numberWithCommas(cuoc);
            //helper.nFormatter(cuoc, 1);
            this.lastTotalCuoc = cuoc;
        } else {
            this.totall.string = '';
        }
    },
    Select: function (x) {
        this.xSprite.node.active = x != 1;
        this.xSprite.spriteFrame = x == 2 ? this.x2Sprite : this.x3Sprite;
    },
    unSelect: function () {
        this.xSprite.node.active = false;
    },
    clearCuoc: function () {
        this.lastTotalCuoc = 0;
        this.totall.string = '';
        this.me.string = '';
    },
    updateState: function (show) {
        this.node.children[1].active = show;
        this.node.children[2].active = show;
    },
    resetState: function () {
        this.node.children[1].active = false; // highlight
        this.node.children[2].active = true;
    },
});