const authManager = require('./../../../common/auth/AuthManager');

cc.Class({
  extends: cc.Component,

  properties: {
    avatar: cc.Sprite,
    nodeUsers: {
      default: null,
      type: cc.Node
    },
    nodeGuest: {
      default: null,
      type: cc.Node
    },
    exp: {
      default: null,
      type: cc.Node
    },
    userName: {
      default: null,
      type: cc.Label
    },
    vip: cc.Label,
    userRed: {
      default: null,
      type: cc.Label
    },
    userXu: {
      default: null,
      type: cc.Label
    },
    maskFull: 0,
    avatarImages: {
      default: [],
      type: cc.SpriteFrame
    },
    signOutbtn: {
      default: null,
      type: cc.Node
    }
  },
  onLoad() {
    if (cc.RedT.IS_LOGIN) {
      this.isSignIn();
    } else {
      this.isSignOut();
    }
  },
  isSignIn: function () {
    if (authManager.isSSO() && this.signOutbtn) {
      this.signOutbtn.active = false;
    }
    this.nodeUsers.active = true;
    this.nodeGuest.active = false;
  },
  isSignOut: function () {
    this.userName.string = this.userRed.string = "";
    this.nodeUsers.active = false;
    this.nodeGuest.active = true;
  },
  level: function (level) {
    this.vip.string = "VIP" + level;
  },
  updateEXP: function (ht, next) {
    this.exp.width = (ht / next) * this.maskFull;
  },
  reset: function () {
    this.level(cc.RedT.user.level);
    this.updateEXP(cc.RedT.user.vipHT, cc.RedT.user.vipNext);
  },
  signOut: function () {
    cc.RedT.inGame.notice.show({
      title: "ĐĂNG XUẤT",
      text:
        "Bạn có muốn đăng xuất không?",
      button: { type: "sign_out", text: "ĐỒNG Ý" }
    });
  },
  setAvatar: function (avatarId) {
    this.avatar.spriteFrame = this.avatarImages[avatarId];
  }
});
