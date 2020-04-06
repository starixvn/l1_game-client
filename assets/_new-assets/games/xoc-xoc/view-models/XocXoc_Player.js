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
            this.balance.string = !!data.red ? helper.numberWithCommas(data.red) : 0;
            !!data.name && (this.nickname.string = data.name.length > 8 ? data.name.substring(0, 7) + "..." : data.name);
            !!data.avatarId && this.setAvatar(data.avatarId);
        } else {
            this.node.active = false;
        }
    },
    setAvatar: function (avatarId) {
        let self = this;
        cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
            let frame = atlas.getSpriteFrame(avatarId == 0 ? 1 : avatarId);
            self.Avatar.spriteFrame = frame;
        });
    }
})