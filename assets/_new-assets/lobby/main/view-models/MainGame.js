import * as authManager from './../../../common/auth/AuthManager';
import baseControll from "../../../BaseController";
import helper from "../../../common/helpers/Helper";
import logger from '../../../common/logger';
const sentryLogger = logger();
import { gameIds } from './../../../Configs';


var header = require("Header"),
  center = require("Menu"),
  dialog = require("Dialog"),
  ThongBaoNoHu = require("PushNohu"),
  newsContents = require("NewsContents");

cc.Class({
  extends: cc.Component,
  properties: {
    PrefabT: {
      default: [],
      type: cc.Prefab
    },
    header: header,
    center: center,
    menuCenter: cc.Node,
    news: cc.Node,
    newsContents: newsContents,
    iconVQRed: cc.Node,
    iconCandy: cc.Node,
    iconLongLan: cc.Node,
    iconTaiXiu: cc.Node,
    iconMegaJ: cc.Node,
    redhat: cc.Node,
    dialog: dialog,
    loading: cc.Node,
    ThongBaoNoHu: ThongBaoNoHu,
    audioBG: cc.AudioSource,
    url: cc.String,
    appApk: cc.String,
    NoticePrefab: cc.Prefab
  },
  onDestroy() {
    cc.RedT.MiniPanel.destroy();
    cc.RedT.inGame = null;
  },
  onLoad: function () {
    document.cookie = "redT=1702;path=/";
    if (void 0 === cc.RedT) {
      cc.RedT = baseControll;
      cc.RedT.init(this.loading);
    }
    cc.RedT.inGame = this;

    cc.game.on(cc.game.EVENT_HIDE, function () {
      cc.RedT.GAME_IS_SHOWED = false;
    });

    cc.game.on(cc.game.EVENT_SHOW, function () {
      cc.RedT.GAME_IS_SHOWED = true;
      cc.RedT.IS_LOGIN && cc.RedT.send({ user: { updateCoint: true } });
    });

    cc.RedT.audio = this.PrefabT[0].data.getComponent("MainAudio");
    // Connect Server
    cc.RedT.reconnect();

    this.dialog.init();
    this.newsContents.init(this);

    var MiniPanel = cc.instantiate(this.PrefabT[1]);
    cc.RedT.MiniPanel = MiniPanel.getComponent("MiniPanel");
    this.redhat.insertChild(MiniPanel);

    if (authManager && !cc.RedT.IS_LOGIN) {
      authManager.triggerSignIn(this, this.loading);
    }

    if (cc.RedT.IS_LOGIN) {
      cc.RedT.send({ scene: "home" });
      this.header.reset();
      this.header.userName.string = cc.RedT.user.name;
      this.header.userRed.string = this.formatUserCurrency(cc.RedT.user.red);
      this.header.setAvatar(cc.RedT.user.avatarId);
    }

    //this.center.node.on("size-changed", this.repositionMenu, this);
    if (!cc.sys.isMobile) {
      this.center.node.scale = 0.8;
    }
    //this.repositionMenu();
  },
  repositionMenu() {
    var menuCenterWidth = this.menuCenter.width;
    if (menuCenterWidth < this.center.node.width) {
      this.menuCenter.parent.getComponent(cc.ScrollView).enabled = false;
      this.menuCenter.position = cc.v2(- menuCenterWidth / 2, this.menuCenter.position.y);
    } else {
      this.menuCenter.parent.getComponent(cc.ScrollView).enabled = true;
    }
  },
  auth: function (obj) {
    var self = this;

    if (this.loading) {
      this.loading.active = true;
    }

    if (cc.RedT._socket == null || cc.RedT._socket.readyState != 1) {
      setTimeout(function () {
        cc.RedT.send(obj);
      }, 300);
    } else {
      cc.RedT.send(obj);
    }

    setTimeout(function () {
      if (self && self.loading) {
        self.loading.active = false;
      }
    }, 5000);
  },
  unAuthorized: function (data) {
    if (this.loading) {
      this.loading.active = false;
    }

    if (void 0 !== data["message"]) {
      this.showNotice({
        text: data.isSessionExpired || data.noPassword
          ? "Phiên đăng nhập đã hết hạn, bạn vui lòng đăng nhập lại."
          : "Có lỗi xảy ra, vui lòng kiểm tra lại."
      })
    } else {
      this.showNotice(data);
    }
  },
  Authorized: function (Authorized) {
    this.loading.active = false;
    if (!Authorized) {
      this.dialog.showSignName();
    } else {
      this.signIn();
    }
  },
  onData: function (data) {
    if (void 0 !== data["unauth"]) {
      this.unAuthorized(data["unauth"]);
    }
    if (void 0 !== data.Authorized) {
      this.Authorized(data.Authorized);
    }
    if (void 0 !== data.user) {
      this.dataUser(data.user);
      cc.RedT.userData(data.user);

      try {
        if (data.user.name) {
          const userAgent = window.navigator ? window.navigator.userAgent : 'offline';
          sentryLogger.log(`Logged In User: ${data.user.name} at ${new Date()}\nInfo:\n${JSON.stringify(data.user)} \nBrowser:${userAgent}`);
          if (this.loading) {
            this.loading.active = false;
          }
        }
      } catch (ex) { console.log(ex) }
    }

    cc.RedT.MiniPanel.onGeneralData(data);

    if (void 0 !== data.notice) {
      this.showNotice(data.notice);
    }
    if (void 0 !== data.marqueeMsg && this.newsContents) {
      this.newsContents.onData(data.marqueeMsg);
    }
    if (void 0 !== data.captcha) {
      this.captcha(data.captcha);
    }
    if (void 0 !== data.pushnohu) {
      // this.ThongBaoNoHu.onData(data.pushnohu);
    }
    if (void 0 !== data.loading) {
      this.loading.onData(data.loading);
    }
    if (void 0 !== data.event) {
      this.dialog.DEvent.onData(data.event);
    }
    if (!!data.toGame) {
      this.center.loadGameRoom(data.toGame);
    }
    if (!!data.message) {
      this.dialog.iMessage.onData(data.message);
    }
    if (!!data.removeIsLoading && this.loading) {
      this.loading.active = false;
    }
  },
  captcha: function (data) {
    switch (data.name) {
      case "signUp":
        this.dialog.signUp.initCaptcha(data.data);
        break;

      case "giftcode":
        this.dialog.GiftCode.initCaptcha(data.data);
        break;

      case "forgotpass":
        this.dialog.ForGotPass.initCaptcha(data.data);
        break;

      case "chargeCard":
        this.dialog.shop.NapRed.initCaptcha(data.data);
        break;

      case "withdrawXu":
        this.dialog.shop.TieuRed.MuaXu.initCaptcha(data.data);
        break;
    }
  },
  formatUserCurrency: function (red, currency) {
    const userCurrency = cc.RedT.user.currency
      ? cc.RedT.user.currency.toUpperCase()
      : currency === undefined ? '' : currency;

    return `${helper.numberWithCommas(red)} ${userCurrency}`;
  },
  showNotice: function (noticeData) {
    var noticePrefab = cc.instantiate(this.NoticePrefab);
    var notice = noticePrefab.getComponent("Notice");
    noticeData.button = { text: 'Ok' };
    notice.init(noticeData);
    this.node.addChild(noticePrefab)
  },
  clickNoticeButton: function () {
    switch (this.type) {
      case 'sign_out':
        cc.RedT._socket.close();
        if (authManager) {
          authManager.signOut();
        }
        this.node.active = false;
        break;
      // case 'reg_otp':
      //   this.node.active = false;
      //   if (cc.RedT.inGame.dialog.objShow != null) {
      //     cc.RedT.inGame.dialog.profile.node.previous = cc.RedT.inGame.dialog.objShow;
      //     cc.RedT.inGame.dialog.objShow.active = false;
      //   }
      //   cc.RedT.inGame.dialog.showProfile(null, 'BaoMat');
      //   cc.RedT.inGame.dialog.profile.BaoMat.onSelectHead(null, 'DangKyOTP');
      //   break;
    }
  },
  dataUser: function (data) {
    if (void 0 !== data.red && this.header && this.header.userRed) {
      this.header.userRed.string = this.formatUserCurrency(data.red, data.currency);
    }
    if (void 0 !== window.openGameId) {
      if (window.openGameId == gameIds.XocXoc) {
        this.center.openGame(null, "XocXoc");
      } else if (window.openGameId == gameIds.KenoProMax) {
        this.center.openGame(null, "KenoProMax");
      } else if (window.openGameId == gameIds.Baccarat) {
        this.center.openGame(null, "baccarat");
      } else {
        cc.RedT.MiniPanel.openGame(window.openGameId);
      }
      window.openGameId = null;
    }

    if (void 0 !== data.avatarId) {
      this.header.setAvatar(data.avatarId);
    }

    if (data.ss) {
      authManager.storeSessionData(data.ss);
    }

    if (void 0 !== data.name) {
      this.header.userName.string = data.name;
      sentryLogger.setCharacterName(data.name);
    }
  },
  signOut: function () {
    cc.RedT.user = {};
    cc.RedT.IS_LOGIN = false;
    this.AllReset();
    cc.sys.localStorage.removeItem("infoRed8");
    authManager.signOut();
  },
  onDisconnected: function () {
    this.AllReset();
    cc.sys.localStorage.removeItem("infoRed8");
  },
  onConnected() {
    authManager && authManager.triggerSignIn(this, this.loading);
  },
  signIn: function () {
    cc.RedT.IS_LOGIN = true;
    this.header.isSignIn();
    this.dialog.onBack();
    cc.RedT.MiniPanel && cc.RedT.MiniPanel.onSignIn();
  },
  AllReset: function () {
    this.loading.active = false;
    this.newsContents.reset();
    this.header.isSignOut();
    this.dialog.onCloseDialog();
    this.dialog.iMessage.reset();
  },

  playMusic: function () {
    this.audioBG.play();
  },
  pauseMusic: function () {
    this.audioBG.pause();
  },
  resumeMusic: function () {
    //cc.audioEngine.resumeMusic();
  },
  audioClick: function () {
    cc.RedT.audio.playClick();
  },
  audioUnClick: function () {
    cc.RedT.audio.playUnClick();
  },
  fanpage: function () {
    cc.sys.openURL(this.url + "/fanpage/");
  },
  ios: function () {
    cc.sys.openURL(this.url + "/help/ios");
  },
  android: function () {
    cc.sys.openURL(this.url + "/download/" + this.appApk);
  },
  telegram: function () {
    cc.sys.openURL(this.url + "/telegram/");
  },
  onGetHu: function () {
    // if (void 0 !== cc.RedT.setting.topHu.data) {
    //   var self = this;
    // Vương Quốc Red
    // Promise.all(cc.RedT.setting.topHu.data['vq_red'].filter(function(temp){
    // 	return temp.red == true;
    // }))
    // .then(result => {
    // 	let h100 = result.filter(function(temp){return temp.type == 100});
    // 	let h1k  = result.filter(function(temp){return temp.type == 1000});
    // 	let h10k = result.filter(function(temp){return temp.type == 10000});

    // 	let r100 = helper.getOnlyNumberInString(this.iconVQRed.hu100.string);
    // 	let r1k  = helper.getOnlyNumberInString(this.iconVQRed.hu1k.string);
    // 	let r10k = helper.getOnlyNumberInString(this.iconVQRed.hu10k.string);

    // 	if (r100-h100[0].bet != 0) {
    // 		helper.numberTo(this.iconVQRed.hu100, helper.getOnlyNumberInString(this.iconVQRed.hu100.string), h100[0].bet, 4900, true);
    // 	}
    // 	if (r1k-h1k[0].bet != 0) {
    // 		helper.numberTo(this.iconVQRed.hu1k, helper.getOnlyNumberInString(this.iconVQRed.hu1k.string), h1k[0].bet, 4900, true);
    // 	}
    // 	if (r10k-h10k[0].bet != 0) {
    // 		helper.numberTo(this.iconVQRed.hu10k, helper.getOnlyNumberInString(this.iconVQRed.hu10k.string), h10k[0].bet, 4900, true);
    // 	}
    // });

    // // Candy
    // Promise.all(cc.RedT.setting.topHu.data['candy'].filter(function(temp){
    // 	return temp.red == true;
    // }))
    // .then(result => {
    // 	let h100 = result.filter(function(temp){return temp.type == 100});
    // 	let h1k  = result.filter(function(temp){return temp.type == 1000});
    // 	let h10k = result.filter(function(temp){return temp.type == 10000});

    // 	let r100 = helper.getOnlyNumberInString(this.iconCandy.hu100.string);
    // 	let r1k  = helper.getOnlyNumberInString(this.iconCandy.hu1k.string);
    // 	let r10k = helper.getOnlyNumberInString(this.iconCandy.hu10k.string);

    // 	if (r100-h100[0].bet != 0) {
    // 		helper.numberTo(this.iconCandy.hu100, helper.getOnlyNumberInString(this.iconCandy.hu100.string), h100[0].bet, 4900, true);
    // 	}
    // 	if (r1k-h1k[0].bet != 0) {
    // 		helper.numberTo(this.iconCandy.hu1k, helper.getOnlyNumberInString(this.iconCandy.hu1k.string), h1k[0].bet, 4900, true);
    // 	}
    // 	if (r10k-h10k[0].bet != 0) {
    // 		helper.numberTo(this.iconCandy.hu10k, helper.getOnlyNumberInString(this.iconCandy.hu10k.string), h10k[0].bet, 4900, true);
    // 	}
    // });

    // // Long Lan
    // Promise.all(cc.RedT.setting.topHu.data['long'].filter(function(temp){
    // 	return temp.red == true;
    // }))
    // .then(result => {
    // 	let h100 = result.filter(function(temp){return temp.type == 100});
    // 	let h1k  = result.filter(function(temp){return temp.type == 1000});
    // 	let h10k = result.filter(function(temp){return temp.type == 10000});

    // 	let r100 = helper.getOnlyNumberInString(this.iconLongLan.hu100.string);
    // 	let r1k  = helper.getOnlyNumberInString(this.iconLongLan.hu1k.string);
    // 	let r10k = helper.getOnlyNumberInString(this.iconLongLan.hu10k.string);

    // 	if (r100-h100[0].bet != 0) {
    // 		helper.numberTo(this.iconLongLan.hu100, helper.getOnlyNumberInString(this.iconLongLan.hu100.string), h100[0].bet, 4900, true);
    // 	}
    // 	if (r1k-h1k[0].bet != 0) {
    // 		helper.numberTo(this.iconLongLan.hu1k, helper.getOnlyNumberInString(this.iconLongLan.hu1k.string), h1k[0].bet, 4900, true);
    // 	}
    // 	if (r10k-h10k[0].bet != 0) {
    // 		helper.numberTo(this.iconLongLan.hu10k, helper.getOnlyNumberInString(this.iconLongLan.hu10k.string), h10k[0].bet, 4900, true);
    // 	}
    // });

    /*
    // MegaJacpot
    Promise.all(cc.RedT.setting.topHu.data['megaj'].filter(function(temp){
      return temp.red == true;
    }))
    .then(result => {
      let h100 = result.filter(function(temp){return temp.type == 100});
      let h1k  = result.filter(function(temp){return temp.type == 1000});
      let h10k = result.filter(function(temp){return temp.type == 10000});
 
      let r100 = helper.getOnlyNumberInString(this.iconMegaJ.hu100.string);
      let r1k  = helper.getOnlyNumberInString(this.iconMegaJ.hu1k.string);
      let r10k = helper.getOnlyNumberInString(this.iconMegaJ.hu10k.string);
 
      if (r100-h100[0].bet != 0) {
        helper.numberTo(this.iconMegaJ.hu100, helper.getOnlyNumberInString(this.iconMegaJ.hu100.string), h100[0].bet, 4900, true);
      }
      if (r1k-h1k[0].bet != 0) {
        helper.numberTo(this.iconMegaJ.hu1k, helper.getOnlyNumberInString(this.iconMegaJ.hu1k.string), h1k[0].bet, 4900, true);
      }
      if (r10k-h10k[0].bet != 0) {
        helper.numberTo(this.iconMegaJ.hu10k, helper.getOnlyNumberInString(this.iconMegaJ.hu10k.string), h10k[0].bet, 4900, true);
      }
    });
    */
    //   }
  },
  /**
	
    checkLoginFacebook: function() {
      if (cc.sys.isBrowser && FB) {
        var self = this;
        self.loading.active = true;
        !isInitFB && FB && FB.init({
          appId: "1979927462336372",
          autoLogAppEvents: !0,
          xfbml: !0,
          cookie: !0,
          version: "v3.1"
        }),
        FB.getLoginStatus(function(t) {
          if ("connected" === t.status) {
            var e = t.authResponse.userID
              , i = s.LOGIN_FACEBOOK_TYPE
              , o = t.authResponse.accessToken;
            self.loginSocial(e, "", i, o)
          } else
            self.setAutoLogin(!1),
          self.loading.active = false;
        })
      }
    },
    loginFacebook: function() {
      if (cc.sys.isBrowser && FB) {
        var self = this;
        self.loading.active = true;
        FB && (FB.init({
          appId: "308158023154919",
          autoLogAppEvents: !0,
          xfbml: !0,
          cookie: !0,
          version: "v3.1"
        }),
        FB.login(function(t) {
          console.log(t)
          self.loading.active = false;
          if (t.authResponse) {
            var uid   = t.authResponse.userID
              , type  = s.LOGIN_FACEBOOK_TYPE
              , token = t.authResponse.accessToken;
            self.loginSocial(uid, "", type, token)
          } else
            self.setAutoLogin(!1),
        }))
      }
    },
    loginSocial: function(e, i, o, n, t) {
      var s = this
        , a = {
        social_id: e,
        email: i,
        social_type: o,
        access_token: n,
        register_code: this.getRegisterCode(),
        mkt_code: this.getMarketingCode(),
        device_id: this.getDeviceID(),
        fid: this.getFID()
      };
      t && (a.otp = t);
      this.api.registerSocial(a, function(t) {
        0 === t.data.login_status ? (s.OTPLogin.setLoginFacebook(e, i, o, n),
        s.OTPLogin.clear(),
        s.hideProcessingNode(),
        s.GameCenterUI.showOtpLoginFormNode()) : (s.setAutoLogin(!0),
        s.setAccountType(!0),
        s.initDataAndConnectSFS(t.data),
        s.GameCenterUI.hideOtpLoginFormNode(),
        t.data.user.is_new && c.addTrackCompleteRegistration())
      }, function(t) {
        s.setAutoLogin(!1),
        s.deProcessingNode(),
        s.showDialogMessage(r.LOGIN_TITLE, t.msg)
      })
    },
    */
});
