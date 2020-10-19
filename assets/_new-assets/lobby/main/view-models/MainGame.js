import baseControll from "../../../BaseController";
import BaseSocketIOController from "../../../BaseSocketIOController";
import GameUtils from "../../../common/GameUtils";
import helper from "../../../common/helpers/Helper";
import logger from "../../../common/logger";
import SabaConfigs from "../../../SabaConfigs";
import * as authManager from "./../../../common/auth/AuthManager";

const sentryLogger = logger();

var header = require("Header"),
  dialog = require("Dialog"),
  newsContents = require("NewsContents");

cc.Class({
  extends: cc.Component,
  properties: {
    PrefabT: {
      default: [],
      type: cc.Prefab,
    },
    header: header,
    center: cc.Node,
    mainScroll: cc.Node,
    gameAds: cc.Node,
    scrollContent: cc.Node,
    news: cc.Node,
    newsContents: newsContents,
    iconVQRed: cc.Node,
    iconCandy: cc.Node,
    iconLongLan: cc.Node,
    iconTaiXiu: cc.Node,
    iconMegaJ: cc.Node,
    redhat: cc.Node,
    dialogNode: cc.Node,
    loading: cc.Node,
    audioBG: cc.AudioSource,
    url: cc.String,
    appApk: cc.String,
    NoticePrefab: cc.Prefab,
  },
  onDestroy() {
    this.dialogNode.destroy();
    cc.RedT.MiniPanel.destroy();
    cc.RedT.inGame = null;
  },
  onLoad: function () {
    this.dialog = this.dialogNode.getComponent('Dialog');
    document.cookie = 'redT=1702;path=/';

    if (void 0 === cc.RedT) {
      cc.RedT = baseControll;
      cc.RedT.init(this.loading);
    }

    cc.RedT.inGame = this;

    cc.game.on(
      cc.game.EVENT_HIDE,
      function () {
        cc.RedT.GAME_IS_SHOWED = false;
        this.sleepTime = new Date();
      }.bind(this)
    );

    cc.game.on(
      cc.game.EVENT_SHOW,
      function () {
        cc.RedT.GAME_IS_SHOWED = true;
        cc.RedT.IS_LOGIN && cc.RedT.send({ user: { updateCoin: true } });

        if (cc.sys.isMobile) {
          const sleepSecond = (new Date() - this.sleepTime) / 1000;

          if (sleepSecond > 300) {
            cc.RedT.MiniPanel.onForceReload(false);
          }
        }
      }.bind(this)
    );

    cc.RedT.audio = this.PrefabT[0].data.getComponent('MainAudio');
    // Connect Server
    cc.RedT.reconnect();

    this.dialog.init();
    this.newsContents.init(this);

    var MiniPanel = cc.instantiate(this.PrefabT[1]);
    cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
    this.redhat.insertChild(MiniPanel);
    this.dialogNode.removeFromParent();
    MiniPanel.addChild(this.dialogNode);

    this.inRoomGameId = authManager.getInRoomGameId();

    if (authManager && !cc.RedT.IS_LOGIN && !this.inRoomGameId) {
      authManager.triggerSignIn(this, this.loading);
    } else {
      !window.openGameId && this.openInRoomGame(this.inRoomGameId);
    }

    if (cc.RedT.IS_LOGIN) {
      cc.RedT.send({ scene: "home" });
      this.getGameNotifications();
      this.header.userName.string = cc.RedT.user.name;
      this.header.userRed.string = this.formatUserCurrency(cc.RedT.user.red);
      this.header.setAvatar(cc.RedT.user.avatarId);
    }

    this.center.on("size-changed", this.repositionMenu, this);
    if (!cc.sys.isMobile) {
      this.center.scale = 0.8;
    }

    const gameIconLayout = this.mainScroll.getComponent('GameIconLayout');
    gameIconLayout.miniPanel = cc.RedT.MiniPanel;
    gameIconLayout.initializedCallback = () => {
      if (this.node === null) {
        return;
      }
      this.repositionMenu();
    };
  },
  getGameNotifications() {
    cc.RedT.send({
      gameNotifications: {
        gameId: 23
      }
    });
  },
  repositionMenu() {
    const adsWidth = this.gameAds.width;
    const scrollContentWidth = this.scrollContent.width + adsWidth;
    const scrollView = this.scrollContent.parent.getComponent(cc.ScrollView);
    const adsWidget = this.gameAds.getComponent(cc.Widget);
    if (scrollContentWidth < this.center.width) {
      scrollView.enabled = false;
      this.scrollContent.position = cc.v2(-scrollContentWidth / 2 + adsWidth / 2, this.scrollContent.position.y);
      adsWidget.enabled = false;
      this.gameAds.position = cc.v2(-scrollContentWidth / 2 + adsWidth / 2, this.gameAds.position.y);
    } else {
      scrollView.enabled = true;
      this.scrollContent.position = cc.v2(-scrollView.node.width / 2, this.scrollContent.position.y);
      adsWidget.enabled = true;
    }
  },
  outRoomGame: function () {
    //please dont remove this method, it's used in openGameRoom method in MiniPanel.ts file
    return new Promise((resolve) => {
      BaseSocketIOController.getInstance().closeMiniGameSockets();
      resolve();
    });
  },

  unAuthorized: function (data) {
    if (this.loading) {
      this.loading.active = false;
    }

    if (void 0 !== data['message']) {
      this.showNotice({
        text:
          data.isSessionExpired || data.noPassword
            ? 'Phiên đăng nhập đã hết hạn, bạn vui lòng đăng nhập lại.'
            : 'Có lỗi xảy ra, vui lòng kiểm tra lại.',
      });
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
    if (void 0 !== data['unauth']) {
      this.unAuthorized(data['unauth']);
    }

    if (void 0 !== data.user) {
      this.loadUserData(data.user);
      cc.RedT.userData(data.user);

      try {
        if (data.user.name) {
          if (this.loading) {
            this.loading.active = false;
          }
        }
      } catch (ex) {
        console.log(ex);
        const userAgent = window.navigator ? window.navigator.userAgent : 'offline';
        sentryLogger.logError(
          `Logged In User: ${data.user.name} at ${new Date()}\nInfo:\n${JSON.stringify(data.user)} \nBrowser:${userAgent}\nError:${ex}`
        );
      }
    }

    if (void 0 !== data.Authorized) {
      this.Authorized(data.Authorized);
    }

    cc.RedT.MiniPanel.onGeneralData(data);

    if (void 0 !== data.marqueeMsg && this.newsContents) {
      this.newsContents.onData(data.marqueeMsg);
    }
    if (void 0 !== data.captcha) {
      this.captcha(data.captcha);
    }
    if (void 0 !== data.loading) {
      this.loading.onData(data.loading);
    }
    if (!!data.removeIsLoading && this.loading) {
      this.loading.active = false;
    }
  },
  captcha: function (data) {
    switch (data.name) {
      case 'signUp':
        this.dialog.signUp.initCaptcha(data.data);
        break;

      case 'giftcode':
        this.dialog.GiftCode.initCaptcha(data.data);
        break;

      case 'forgotpass':
        this.dialog.ForGotPass.initCaptcha(data.data);
        break;

      case 'chargeCard':
        this.dialog.shop.NapRed.initCaptcha(data.data);
        break;

      case 'withdrawXu':
        this.dialog.shop.TieuRed.MuaXu.initCaptcha(data.data);
        break;
    }
  },
  formatUserCurrency: function (red, currency) {
    const userCurrency = cc.RedT.user.currency ? cc.RedT.user.currency.toUpperCase() : currency === undefined ? '' : currency;

    return `${helper.numberWithCommas(red)} ${userCurrency}`;
  },
  showNotice: function (noticeData) {
    var noticePrefab = cc.instantiate(this.NoticePrefab);
    var notice = noticePrefab.getComponent('Notice');
    noticeData.button = { text: 'OK' };
    notice.init(noticeData);
    this.node.addChild(noticePrefab);
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
  loadUserData: function (data) {
    if (void 0 !== data.red && this.header && this.header.userRed) {
      this.header.userRed.string = this.formatUserCurrency(data.red, data.currency);
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
    cc.sys.localStorage.removeItem('infoRed8');
    authManager.signOut();
  },
  onDisconnected: function () {
    this.AllReset();
    cc.sys.localStorage.removeItem('infoRed8');
  },
  signIn: function () {
    cc.RedT.IS_LOGIN = true;
    this.header.isSignIn();
    this.dialog.onBack();
    cc.RedT.MiniPanel && cc.RedT.MiniPanel.onSignIn();
    this.openGameSSO();
    this.getGameNotifications();
  },
  openGameSSO: function () {
    if (window.openGameId) {
      const gameId = parseInt(window.openGameId);
      GameUtils.openGame(gameId, cc.RedT.MiniPanel);
      window.openGameId = null;
    }
  },

  openInRoomGame(gameId) {
    if (SabaConfigs.gameRoomNewSocketIds.includes(+gameId)) {
      cc.RedT.MiniPanel.openNewGameSocket(null, +gameId);
    }
  },
  AllReset: function () {
    this.loading.active = false;
    this.newsContents.reset();
    this.header.isSignOut();
    this.dialog.onCloseDialog();
    // this.dialog.iMessage.reset();
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
    cc.sys.openURL(this.url + '/fanpage/');
  },
  ios: function () {
    cc.sys.openURL(this.url + '/help/ios');
  },
  android: function () {
    cc.sys.openURL(this.url + '/download/' + this.appApk);
  },
  telegram: function () {
    cc.sys.openURL(this.url + '/telegram/');
  },
});
