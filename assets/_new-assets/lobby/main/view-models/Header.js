import configs from '../../../Configs';
import * as authManager from './../../../common/auth/AuthManager';

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

    signOutbtn: {
      default: null,
      type: cc.Node
    },
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
    if (authManager.isSSO() && this.signOutbtn) {
      this.signOutbtn.active = false;
    }
    this.nodeUsers.active = true;
    this.nodeGuest.active = false;
  },
  isSignOut: function () {
    this.userName.string = this.userRed.string = "";
    this.nodeUsers.active = false;
    this.nodeGuest.active = !configs.disabledDirectLogin;
  },
  reset: function () {
  },
  signOut: function () {
    var noticePrefab = cc.instantiate(this.NoticePrefab);
    var notice = noticePrefab.getComponent("Notice");
    notice.handleClickButton = function () {
      cc.RedT._socket.close();

      if (authManager) {
        authManager.signOut();
      }
      this.node.active = false;
    }
    notice.init({
      title: "ĐĂNG XUẤT",
      isInfo: true,
      text:
        "Bạn có muốn đăng xuất không?",
      button: { type: "sign_out", text: "ĐỒNG Ý" }
    });

    this.node.parent.addChild(noticePrefab);
  },
  setAvatar: function (avatarId) {
    let self = this;
    cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
      if (self && self.avatar) {
        let frame = atlas.getSpriteFrame(avatarId == 0 ? 1 : avatarId);
        self.avatar.spriteFrame = frame;
      }
    });
  }
});