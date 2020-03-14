var helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        nickname: cc.Label,
        balance: cc.Label,
        Avatar: cc.Sprite,
    },

    setInfo: function (data) {
        if (!!data) {
            this.node.active = true;
            !!data.red && (this.balance.string = helper.numberWithCommas(data.red));
            !!data.name && (this.nickname.string = data.name);
        } else {
            this.node.active = false;
        }
    },
})