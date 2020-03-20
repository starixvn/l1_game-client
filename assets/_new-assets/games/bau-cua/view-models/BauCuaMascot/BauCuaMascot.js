var helper = require('Helper');

cc.Class({
    extends: cc.Component,
    properties: {
        xLabel: cc.Label,
        totall: cc.Label,
        me: cc.Label,
    },

    onLoad() {
        this.lastTotalCuoc = 0;
    },

    meCuoc: function (cuoc) {
        if (!!cuoc) {
            this.me.string = helper.nFormatter(cuoc, 1);
        }
    },
    totallCuoc: function (cuoc) {
        if (!!cuoc) {
            helper.numberTo(this.totall, this.lastTotalCuoc, cuoc, 1000);
            this.lastTotalCuoc = cuoc;
        } else {
            this.totall.string = '';
        }
    },
    Select: function (x) {
        this.xLabel.node.active = x != 1;
        this.xLabel.string = 'x' + x;
    },
    unSelect: function () {
        this.xLabel.node.active = false;
    },
    clearCuoc: function () {
        this.lastTotalCuoc = 0;
        this.totall.string = 0;
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