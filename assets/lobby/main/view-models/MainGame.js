import { appContainer } from '../../../Application';
import baseControll from '../../../BaseController';
import GameUtils from '../../../common/GameUtils';
import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import logger from '../../../common/logger';
import * as SabaConfigs from '../../../configs/SabaConfigs';
import FourGuardiansConfig from '../../../games/four-guardians/scripts/FourGuardiansConfig';
import SocketIOController from '../../../SocketIOController';
import SplashConfig from '../../../splash/view-models/SplashConfig';
import * as authManager from './../../../common/auth/AuthManager';

const socketIOController = appContainer.get(SocketIOController);
const fourGuardiansConfig = appContainer.get(FourGuardiansConfig);
const sentryLogger = logger();

var header = require("Header"),
    newsContents = require("NewsContents");

cc.Class({
    extends: cc.Component,
    properties: {
        PrefabT: {
            default: [],
            type: cc.Prefab
        },
        header: header,
        center: cc.Node,
        mainScroll: cc.Node,
        bannerContainer: cc.Node,
        adsBannerContainer: cc.Node,
        jackpotBannerContainer: cc.Node,
        adsToggle: cc.Toggle,
        jackpotToggle: cc.Toggle,
        scrollContent: cc.Node,
        news: cc.Node,
        newsContents: newsContents,
        redhat: cc.Node,
        dialogNode: cc.Node,
        loading: cc.Node,
        audioBG: cc.AudioSource,
        NoticePrefab: cc.Prefab,
        luckyWheelIconPrefab: cc.Prefab
    },
    onDestroy() {
        this.dialogNode.destroy();
        cc.RedT.MiniPanel.destroy();
        cc.RedT.inGame = null;
    },
    onLoad: function () {
        this.dialog = this.dialogNode.getComponent("Dialog");
        document.cookie = "redT=1702;path=/";

        if (void 0 === cc.RedT) {
            cc.RedT = baseControll;
            console.log("cc.RedT ready");
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

        cc.RedT.audio = this.PrefabT[0].data.getComponent("MainAudio");
        // Connect Server
        cc.RedT.reconnect();

        this.dialog.init();
        this.newsContents.init(this);

        var MiniPanel = cc.instantiate(this.PrefabT[1]);
        cc.RedT.MiniPanel = MiniPanel.getComponent("MiniPanel");
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
            this.onSignIn();
            this.header.userName.string = cc.RedT.user.name;
            this.header.userRed.string = this.formatUserCurrency(cc.RedT.user.red);
            this.header.setAvatar(cc.RedT.user.avatarId);
            (cc.RedT.user.availSpins || cc.RedT.user.scoins) && this.header.showScoins(cc.RedT.user.scoins);

            cc.RedT.needShowLuckyWheelIcon && this.renderLuckyWheelIcon();
        }

        // this.center.on("size-changed", this.repositionMenu, this);
        // this.center.on("scale-changed", this.repositionMenu, this);
        if (!cc.sys.isMobile) {
            this.center.scale = 0.8;
        }
        console.log("end onLoad");
    },
    onSignIn() {
        this.getGameNotifications();
        this.initLobbyMenu();
        this.initBanners();
    },
    initLobbyMenu() {
        const lobbyMenu = this.mainScroll.addComponent("LobbyMenu");
        lobbyMenu.content = this.scrollContent;
        lobbyMenu.miniPanel = cc.RedT.MiniPanel;
        lobbyMenu.initializedCallback = () => {
            if (this.node === null) {
                return;
            }
            this.repositionMenu();
        };
        lobbyMenu.initItems();
    },
    initBanners() {
        const showJackpotBanner =
            cc.RedT.user.offerGames.includes(SabaConfigs.games.FourGuardians.id) && fourGuardiansConfig.jackpotEnabled;
        this.jackpotToggle.node.parent.active = showJackpotBanner;

        const jpBannerController = this.jackpotBannerContainer.getComponent("BannerController");
        const adsBannerController = this.adsBannerContainer.getComponent("DynamicAdsBannerController");

        jpBannerController.onEndingRound = () => {
            this.jackpotToggle.isChecked = false;
            this.adsToggle.isChecked = true;

            this.switchBanner(false);
        };

        adsBannerController.menuLoop = !showJackpotBanner;
        adsBannerController.setGameAds([28, 27, 25]);
        adsBannerController.onEndingRound = () => {
            if (showJackpotBanner) {
                this.adsToggle.isChecked = false;
                this.jackpotToggle.isChecked = true;

                this.switchBanner(true);
            }
        };
        adsBannerController.showFirstPage();
    },
    switchBanner(showJackpot, reset) {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                this.adsBannerContainer.active = !showJackpot;
                this.jackpotBannerContainer.active = showJackpot;

                const currentContainer = showJackpot ? this.adsBannerContainer : this.jackpotBannerContainer;
                const newContainer = !showJackpot ? this.adsBannerContainer : this.jackpotBannerContainer;

                const currentController = currentContainer.getComponent("BannerController");
                const newController = newContainer.getComponent("BannerController");

                if (currentController.currentIndex > 0 || reset) {
                    newController.showFirstPage();
                } else {
                    newController.showLastPage();
                }
            })
            .start();
    },
    getGameNotifications() {
        const list = [23, 29];
        list.forEach((id) => {
            cc.RedT.send({
                gameNotifications: {
                    gameId: id
                }
            });
        });
    },
    repositionMenu() {
        const adsWidth = this.bannerContainer.width;
        const scrollContentWidth = this.scrollContent.width + adsWidth;
        const scrollView = this.mainScroll.getComponent(cc.ScrollView);
        const adsWidget = this.bannerContainer.getComponent(cc.Widget);
        if (scrollContentWidth < this.center.width) {
            scrollView.enabled = false;
            this.scrollContent.position = cc.v2(-scrollContentWidth / 2 + adsWidth / 2, this.scrollContent.position.y);
            adsWidget.enabled = false;
            this.bannerContainer.position = cc.v2(-scrollContentWidth / 2 + adsWidth / 2, this.bannerContainer.position.y);
        } else {
            scrollView.enabled = true;
            adsWidget.enabled = true;
            scrollView.scrollTo(0, 0);
        }
    },
    onBannerTypeChanged(e, param) {
        const type = +param;
        const showJackpot = type === 1;
        this.switchBanner(showJackpot, true);
    },
    outRoomGame: function () {
        //please dont remove this method, it's used in openGameRoom method in MiniPanel.ts file
        return new Promise((resolve) => {
            socketIOController.closeMiniGameSockets();
            resolve();
        });
    },

    unAuthorized: function (data) {
        if (this.loading) {
            this.loading.active = false;
        }

        if (void 0 !== data["message"]) {
            this.showNotice({
                text:
                    data.isSessionExpired || data.noPassword
                        ? "Phiên đăng nhập đã hết hạn, bạn vui lòng đăng nhập lại."
                        : "Có lỗi xảy ra, vui lòng kiểm tra lại."
            });
        } else {
            this.showNotice(data);
        }
    },
    Authorized: function (Authorized) {
        this.loading.active = false;

        cc.RedT.needShowLuckyWheelIcon = cc.RedT.user.availSpins > 0;
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

        if (void 0 !== data.user) {
            this.handleUserData(data.user);
        }

        if (void 0 !== data.Authorized) {
            this.Authorized(data.Authorized);
        }

        cc.RedT.MiniPanel.onGeneralData(data);

        if (void 0 !== data.marqueeMsg && this.newsContents) {
            this.newsContents.onData(data.marqueeMsg);
        }

        if (void 0 !== data.loading) {
            this.loading.onData(data.loading);
        }

        if (!!data.removeIsLoading && this.loading) {
            this.loading.active = false;
        }

        // open result page
        if (data.gameResult) {
            const { redirectUrl } = data.gameResult;
            this.openResultPage(redirectUrl);
        }
    },

    handleUserData: function (user) {
        this.loadUserData(user);
        cc.RedT.userData(user);

        try {
            if (user.name) {
                if (this.loading) {
                    this.loading.active = false;
                }
            }
        } catch (ex) {
            const userAgent = window.navigator ? window.navigator.userAgent : "offline";
            sentryLogger.logError(
                `Logged In User: ${user.name} at ${new Date()}\nInfo:\n${JSON.stringify(user)} \nBrowser:${userAgent}\nError:${ex}`
            );
        }
    },

    formatUserCurrency: function (red, currency) {
        const splashConfig = new SplashConfig();

        if (splashConfig.enabledSC1) {
            let userCurrency = "";
            if (cc.RedT.user.currency) {
                userCurrency = cc.RedT.user.currency.toUpperCase();
            } else {
                userCurrency = currency === undefined ? "" : currency;
            }

            return `${numberWithCommas(red)} ${userCurrency}`;
        } else {
            return `${numberWithCommas(red)}`;
        }
    },
    showNotice: function (noticeData) {
        var noticePrefab = cc.instantiate(this.NoticePrefab);
        var notice = noticePrefab.getComponent("Notice");
        noticeData.button = { text: "OK" };
        notice.init(noticeData);
        this.node.addChild(noticePrefab);
    },
    clickNoticeButton: function () {
        if (this.type === sign_out) {
            cc.RedT._socket.close();
            if (authManager) {
                authManager.signOut();
            }
            this.node.active = false;
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

        if (data.availSpins || data.scoins) {
            this.header.showScoins(data.scoins);
        }

        if (data.availSpins) {
            this.renderLuckyWheelIcon();
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
    signIn: function () {
        cc.RedT.IS_LOGIN = true;
        this.header.isSignIn();
        this.dialog.onBack();
        cc.RedT.MiniPanel && cc.RedT.MiniPanel.onSignIn();
        this.onSignIn();
        this.openGameSSO();
        this.getJackpotInfo();
    },
    getJackpotInfo() {
        cc.RedT.send({
            jackpot: {
                getPools: true
            }
        });
    },
    openGameSSO: function () {
        if (window.openGameId) {
            const gameId = parseInt(window.openGameId);
            GameUtils.openGame(gameId, cc.RedT.MiniPanel, this.openLuckyWheel.bind(this));
            window.openGameId = null;
        } else {
            !this.inRoomGameId && this.openLuckyWheel();
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
    },

    playMusic: function () {
        this.audioBG.play();
    },
    pauseMusic: function () {
        this.audioBG.pause();
    },
    resumeMusic: function () {},
    audioClick: function () {
        cc.RedT.audio.playClick();
    },
    audioUnClick: function () {
        cc.RedT.audio.playUnClick();
    },

    openResultPage(redirectUrl) {
        cc.RedT.resultPage = window.open(redirectUrl, "", "width=700,height=500");
        cc.RedT.resultPage.focus();

        window.onbeforeunload = function () {
            cc.RedT.resultPage.close();
        };
    },

    onGameResultClick() {
        cc.RedT.send({ gameResult: { language: "vi-VN" } });
    },

    renderLuckyWheelIcon() {
        if (!this.luckyWheelIcon) {
            const iconNode = cc.instantiate(this.luckyWheelIconPrefab);
            this.node.addChild(iconNode);
            this.luckyWheelIcon = iconNode.getComponent("LuckyWheelIcon");
            this.luckyWheelIcon.init(this.node);
        }
    },

    openLuckyWheel() {
        if (cc.RedT.user && cc.RedT.user.name) {
            this.luckyWheelIcon && cc.RedT.user.availSpins && this.luckyWheelIcon.openGame();
        }
    }
});
