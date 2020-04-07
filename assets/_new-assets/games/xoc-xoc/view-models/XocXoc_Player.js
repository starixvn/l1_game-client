var helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        nickname: cc.Label,
        balance: cc.Label,
        avatar: cc.Sprite
    },

    setInfo: function (data) {
        if (!!data) {
            this.node.active = true;
            this.balance.string = !!data.red ? helper.numberWithCommas(data.red) : 0;
            !!data.name && (this.nickname.string = data.name.length > 8 ? data.name.substring(0, 7) + "..." : data.name);
            this.setAvatar(data.avatarId);
        } else {
            this.node.active = false;
        }
    },
    setAvatar: function (avatarId) {
        let self = this;
        cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
            let frame = atlas.getSpriteFrame(avatarId ? avatarId : 1);
            if (self && self.avatar) {
                self.avatar.spriteFrame = frame;
            }
        });
    }
})