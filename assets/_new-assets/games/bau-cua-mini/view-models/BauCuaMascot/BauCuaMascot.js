import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

cc.Class({
    extends: cc.Component,
    properties: {
        xSprite: cc.Sprite,
        totall: cc.Label,
        me: cc.Label,
        x2Sprite: cc.SpriteFrame,
        x3Sprite: cc.SpriteFrame
    },

    onLoad() {
        this.lastTotalCuoc = 0;
    },

    meCuoc: function (cuoc) {
        if (!!cuoc) {
            this.me.string = numberWithCommas(cuoc);
        }
    },
    totallCuoc: function (cuoc) {
        this.totall.string = cuoc > 0 ? numberWithCommas(cuoc) : "";
    },
    Select: function (x) {
        this.xSprite.node.active = x !== 1;
        this.xSprite.spriteFrame = x === 2 ? this.x2Sprite : this.x3Sprite;
    },
    unSelect: function () {
        this.xSprite.node.active = false;
    },
    clearCuoc: function () {
        this.lastTotalCuoc = 0;
        this.totall.string = "";
        this.me.string = "";
    },
    updateState: function (show) {
        this.node.children[1].active = show;
        this.node.children[2].active = show;
    },
    resetState: function () {
        this.node.children[1].active = false; // highlight
        this.node.children[2].active = true;
    }
});
