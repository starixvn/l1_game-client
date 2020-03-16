var helper = require('Helper');

cc.Class({
    extends: cc.Component,
    properties: {
        xLabel: cc.Label,
        totall: cc.Label,
        me: cc.Label,
    },
    meCuoc: function (cuoc) {
        if (!!cuoc) {
            this.me.string = helper.nFormatter(cuoc, 1);
        }
    },
    totallCuoc: function (cuoc) {
        if (!!cuoc) {
            this.totall.string = helper.nFormatter(cuoc, 1);
        } else {
            this.totall.string = 0;
        }
    },
    Select: function (x) {
        this.xLabel.node.active = true;
        this.xLabel.string = 'x' + x;
    },
    unSelect: function () {
        this.xLabel.node.active = false;
    },
    clearCuoc: function () {
        this.totall.string = 0;
        this.me.string = '';
    },
    updateState: function (show) {
        this.node.children[0].active = show;
        this.node.children[1].active = show;
    },
    resetState: function () {
        this.node.children[0].active = false; // highlight
        this.node.children[1].active = true;
    },
});