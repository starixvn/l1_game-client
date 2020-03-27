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
            !!data.red && (this.balance.string = helper.numberWithCommas(data.red));
            !!data.name && (this.nickname.string = data.name.length > 8 ? data.name.substring(0, 7) + "..." : data.name);
        } else {
            this.node.active = false;
        }
    },
    setAvatar: function () {
        let avatarId = ((Math.random() * 40) + 1) >> 0
        cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
            let frame = atlas.getSpriteFrame(avatarId);
            self.Avatar.spriteFrame = frame;
        });
    }
})