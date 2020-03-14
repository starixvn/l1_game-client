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
        this.xLabel.string = 'x' + x;
    },
    unSelect: function () {},
    updateState: function (show) {
        this.node.children[0].active = show;
    },
});