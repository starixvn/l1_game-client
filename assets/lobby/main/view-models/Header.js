cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        nodeUsers: {
            default: null,
            type: cc.Node
        },
        userName: {
            default: null,
            type: cc.Label
        },
        userRed: {
            default: null,
            type: cc.Label
        },
        scoinsNode: {
            default: null,
            type: cc.Node
        },
        scoinsValue: {
            default: null,
            type: cc.Label
        },
        maskFull: 0,
        NoticePrefab: cc.Prefab
    },
    onLoad() {
        if (cc.RedT.IS_LOGIN) {
            this.isSignIn();
        } else {
            this.isSignOut();
        }
    },
    isSignIn: function () {
        this.nodeUsers.active = true;
    },
    isSignOut: function () {
        this.userName.string = this.userRed.string = "";
        this.nodeUsers.active = false;
    },
    setAvatar: function (avatarId) {
        const self = this;
        cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
            if (self && self.avatar) {
                const frame = atlas.getSpriteFrame(avatarId === 0 ? 1 : avatarId);
                self.avatar.spriteFrame = frame;
            }
        });
    },
    showScoins(scoins = 0) {
        this.scoinsNode.active = true;
        this.scoinsValue.string = helper.numberWithCommas(scoins);
    }
});
