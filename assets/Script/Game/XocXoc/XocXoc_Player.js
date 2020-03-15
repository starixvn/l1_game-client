var helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        nickname: cc.Label,
        balance: cc.Label,
        Avatar: cc.Sprite,
        avatarImages: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    setInfo: function (data) {
        if (!!data) {
            this.node.active = true;
            !!data.red && (this.balance.string = helper.formatMoneyNumber(data.red));
            !!data.name && (this.nickname.string = data.name);
            console.log(this.Avatar);
        } else {
            this.node.active = false;
        }
    },
    setAvatar: function () {
        this.Avatar.spriteFrame = this.avatarImages[(Math.random() * 12) >> 0];
    }
})