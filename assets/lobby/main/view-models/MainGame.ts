import * as i18n from "i18n/runtime-scripts/LanguageData";

import { appContainer } from "../../../Application";
import * as baseControl from "../../../BaseController";
import AudioManager from "../../../common/audio/AudioManager";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import Loading from "../../../common/loading/view-models/Loading";
import logger from "../../../common/logger";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import * as SabaConfigs from "../../../configs/SabaConfigs";
import FourGuardiansConfig from "../../../games/four-guardians/scripts/FourGuardiansConfig";
import LuckyWheelIcon from "../../../games/lucky-wheel/view-models/LuckyWheelIcon";
import LobbyMenuConfig from "../../../lobby/main/view-models/LobbyMenuConfig";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import SocketIOController from "../../../SocketIOController";
import SplashConfig from "../../../splash/view-models/SplashConfig";
import NewsContent from "../../news/NewsContent";
import CommonDialog from "./../../../common/_base/view-models/CommonDialog";
import * as authManager from "./../../../common/auth/AuthManager";
import * as sessionManager from "./../../../common/auth/SessionManager";
import BannerController from "./BannerController";
import DynamicAdsBannerController from "./DynamicAdsBannerController";
import Header from "./Header";
import LobbyMenu, { GameCategory } from "./LobbyMenu";
import CategoryItem from "./CategoryItem";
import MusicPlayer from "../../../common/audio/MusicPlayer";

const socketIOController = appContainer.get(SocketIOController);
const fourGuardiansConfig = appContainer.get(FourGuardiansConfig);
const lobbyMenuConfig = appContainer.get(LobbyMenuConfig);
const sentryLogger = logger();

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainGame extends cc.Component {
    @property(cc.Prefab)
    miniPanelPrefab: cc.Prefab = null;

    @property(Header)
    header: Header = null;

    @property(cc.Node)
    center: cc.Node = null;

    @property(cc.ScrollView)
    mainScroll: cc.ScrollView = null;

    @property(cc.Node)
    bannerContainer: cc.Node = null;

    @property(cc.Node)
    adsBannerContainer: cc.Node = null;

    @property(cc.Node)
    jackpotBannerContainer: cc.Node = null;

    @property(cc.Toggle)
    adsToggle: cc.Toggle = null;

    @property(cc.Toggle)
    jackpotToggle: cc.Toggle = null;

    @property(cc.Node)
    scrollContent: cc.Node = null;

    @property(cc.Node)
    news: cc.Node = null;

    @property(NewsContent)
    newsContents: NewsContent = null;

    @property(cc.Node)
    redhat: cc.Node = null;

    @property(cc.Node)
    loading: cc.Node = null;

    @property(cc.AudioSource)
    audioBG: cc.AudioSource = null;

    @property(cc.Prefab)
    NoticePrefab: cc.Prefab = null;

    @property(cc.Node)
    categoryContainer: cc.Node = null;

    @property(cc.Node)
    arrowNode: cc.Node = null;

    @property(cc.Prefab)
    signNamePrefab = null;

    private inRoomGameId: string;
    private initializedLobby = false;
    private loadingComponent: Loading;
    private luckyWheelIcon: LuckyWheelIcon;
    private lobbyMenu: LobbyMenu;
    signName: any;

    onDestroy() {
        cc.RedT.MiniPanel.destroy();
        cc.RedT.inGame = null;
        window.isSSO = false;
    }

    onLoad() {
        this.loadingComponent = this.loading.getComponent(Loading);
        document.cookie = "redT=1702;path=/";

        this.initRedT();
        cc.RedT.inGame = this;

        this.initAppEvent();

        cc.RedT.reconnect();

        this.initMiniPanel();
        this.callTriggerSignIn();
        this.onLoadLobby();
        MusicPlayer.getInstance().init();

        this.initScrollListener();
    }

    initScrollListener() {
        this.mainScroll.content.on(cc.Node.EventType.SIZE_CHANGED, this.updateArrowVisibility.bind(this));
        this.mainScroll.node.on("scroll-ended", () => {
            const offset = Math.abs(Math.floor(this.mainScroll.getScrollOffset().x));
            const maxOffset = Math.floor(this.mainScroll.getMaxScrollOffset().x);

            if (offset <= 1 || offset >= maxOffset) {
                const right = offset < maxOffset;
                this.arrowNode.scale = right ? 1 : -1;
            }
        });
    }

    updateArrowVisibility() {
        const scrollable = this.mainScroll.content.width > this.mainScroll.node.width;
        this.arrowNode.parent.active = scrollable;
        this.arrowNode.scale = 1;
    }

    activeCategoryFromStorage(): number {
        const storage = cc.sys.localStorage.getItem("current_game_category");
        let category = 0;
        if (storage !== "") {
            category = parseInt(storage) || GameCategory.All;
        }

        const node = this.categoryContainer.children.find((child) => child.name === `${category}`);
        if (node) {
            node.getComponent(cc.Toggle).check();
        }

        return category;
    }

    activeBgNewOnCategory() {
        const newGames = lobbyMenuConfig.newGames;
        const isTextNewAll = lobbyMenuConfig.list.some((r) => newGames.includes(r)),
            isTextNewSeDie = lobbyMenuConfig.seDieGames.some((r) => newGames.includes(r)),
            isTextNewCasino = lobbyMenuConfig.casinoGames.some((r) => newGames.includes(r)),
            isTextNewCard = lobbyMenuConfig.cardGames.some((r) => newGames.includes(r)),
            isTextNewSlot = lobbyMenuConfig.slotGames.some((r) => newGames.includes(r)),
            isTextNewLottery = lobbyMenuConfig.lotteryGames.some((r) => newGames.includes(r)),
            isTextNewOther = lobbyMenuConfig.othersGames.some((r) => newGames.includes(r));

        const categoryTextNew = [
            { [GameCategory.All]: isTextNewAll },
            { [GameCategory.SeDie]: isTextNewSeDie },
            { [GameCategory.Casino]: isTextNewCasino },
            { [GameCategory.Card]: isTextNewCard },
            { [GameCategory.Slot]: isTextNewSlot },
            { [GameCategory.Lottery]: isTextNewLottery },
            { [GameCategory.Other]: isTextNewOther }
        ];

        categoryTextNew.forEach((category) => {
            const categoryNode = this.categoryContainer.children.find((child) => child.name === `${Object.keys(category)[0]}`);
            const newNode = categoryNode.getComponent(CategoryItem);
            newNode.newNode.active = Object.values(category)[0];
        });
    }

    onFastScrollClick() {
        AudioManager.getInstance().playClick();

        if (this.mainScroll.content.childrenCount === 0) {
            return;
        }

        const offset = Math.abs(this.mainScroll.getScrollOffset().x);
        const maxOffset = Math.abs(this.mainScroll.getMaxScrollOffset().x);
        const direction = this.arrowNode.scaleX;
        const delta = this.mainScroll.node.width;
        let newOffset = offset + direction * delta;

        const layout = this.mainScroll.content.getComponent(cc.Layout);
        const paddingLeft = layout.paddingLeft;
        const paddingRight = layout.paddingRight;
        const spacing = layout.spacingX;
        const itemSize = this.mainScroll.content.children[0].width;
        const stepWidth = itemSize + spacing;

        if (direction > 0) {
            const stepCount = Math.floor((newOffset - paddingLeft) / stepWidth);
            newOffset = paddingLeft + stepCount * stepWidth;
        } else {
            const stepCount = Math.floor((maxOffset - paddingRight - newOffset) / stepWidth);
            newOffset = maxOffset - stepCount * stepWidth;
        }

        this.mainScroll.scrollToOffset(cc.v2(newOffset, 0), 0.4);
    }

    initRedT() {
        if (void 0 === cc.RedT) {
            cc.RedT = baseControl;
            cc.RedT.init(this.loading);
        }
    }

    initAppEvent() {
        cc.game.on(
            cc.game.EVENT_HIDE,
            function () {
                cc.RedT.GAME_IS_SHOWED = false;
            }.bind(this)
        );

        cc.game.on(
            cc.game.EVENT_SHOW,
            function () {
                cc.RedT.GAME_IS_SHOWED = true;
                cc.RedT.IS_LOGIN && cc.RedT.send({ user: { updateCoin: true } });
            }.bind(this)
        );
    }

    initMiniPanel() {
        const miniPanelNode = cc.instantiate(this.miniPanelPrefab);
        cc.RedT.MiniPanel = miniPanelNode.getComponent(MiniPanel);
        this.redhat.insertChild(miniPanelNode, 1);
    }

    callTriggerSignIn() {
        if (authManager && !cc.RedT.IS_LOGIN) {
            authManager.triggerSignIn(this);
        }
    }

    onLoadLobby() {
        if (cc.RedT.IS_LOGIN) {
            cc.RedT.send({ scene: "home" });
            this.onSignIn();
            this.header.setUserName(cc.RedT.user.name);
            this.header.setBalance(this.formatUserCurrency(cc.RedT.user.red));
            this.header.setAvatar(cc.RedT.user.avatarId);
            (cc.RedT.user.availSpins || cc.RedT.user.scoins) && this.header.showScoins(cc.RedT.user.scoins);

            this.renderLuckyWheelIcon();
        }
    }

    onSignIn() {
        if (!this.initializedLobby) {
            this.initLobby();
        }

        this.openGameSSO();
    }

    loadLobbyMenuFromStorage() {
        if (!this.initializedLobby) {
            const storage = cc.sys.localStorage.getItem("latestOfferGames");
            if (storage) {
                cc.RedT.user.offerGames = JSON.parse(storage);
            }
            this.initLobby();
        }
    }

    initLobby() {
        if (cc.RedT.user.offerGames.length === 0) {
            this.showNotice({ text: i18n.t("messages.noGameOffer") });
        }
        this.initLobbyMenu();
        this.initBanners();
        this.initializedLobby = true;
    }

    initLobbyMenu() {
        let lobbyMenu = this.mainScroll.getComponent(LobbyMenu);
        if (lobbyMenu) {
            return;
        }
        lobbyMenu = this.mainScroll.addComponent(LobbyMenu);
        lobbyMenu.content = this.scrollContent;
        lobbyMenu.miniPanel = cc.RedT.MiniPanel;

        this.lobbyMenu = lobbyMenu;

        let category = GameCategory.All;
        if (!window.isSSO) {
            category = this.activeCategoryFromStorage();
        }
        this.activeBgNewOnCategory();

        this.lobbyMenu.setCategory(category);
    }

    initBanners() {
        if (this.adsBannerContainer.childrenCount > 0) {
            return;
        }
        const showJackpotBanner = cc.RedT.user.offerGames.includes(SabaConfigs.GameIds.FourGuardians) && fourGuardiansConfig.jackpotEnabled;
        this.jackpotToggle.node.parent.active = showJackpotBanner;

        const jpBannerController = this.jackpotBannerContainer.getComponent(BannerController);
        const adsBannerController = this.adsBannerContainer.getComponent(DynamicAdsBannerController);

        jpBannerController.onEndingRound = () => {
            this.jackpotToggle.isChecked = false;
            this.adsToggle.isChecked = true;

            this.switchBanner(false);
        };

        adsBannerController.menuLoop = !showJackpotBanner;
        const gameAds = lobbyMenuConfig.bannerAds;
        const offerGames = cc.RedT.user.offerGames;
        const filterList = [];
        gameAds.forEach((id) => {
            if (offerGames.includes(id)) {
                filterList.push(id);
            }
        });

        if (lobbyMenuConfig.smPromotion) {
            // Add SM promotion banner at page 2
            filterList.splice(1, 0, 0);
        }

        adsBannerController.setGameAds(filterList);
        adsBannerController.onEndingRound = () => {
            if (showJackpotBanner) {
                this.adsToggle.isChecked = false;
                this.jackpotToggle.isChecked = true;

                this.switchBanner(true);
            }
        };
        adsBannerController.showFirstPage();
    }

    switchBanner(showJackpot: boolean, reset = false) {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                this.adsBannerContainer.active = !showJackpot;
                this.jackpotBannerContainer.active = showJackpot;

                const currentContainer = showJackpot ? this.adsBannerContainer : this.jackpotBannerContainer;
                const newContainer = !showJackpot ? this.adsBannerContainer : this.jackpotBannerContainer;

                const currentController = currentContainer.getComponent(BannerController);
                const newController = newContainer.getComponent(BannerController);

                if (currentController.currentIndex > 0 || reset) {
                    newController.showFirstPage();
                } else {
                    newController.showLastPage();
                }
            })
            .start();
    }

    repositionMenu() {
        const adsWidth = this.bannerContainer.width;
        const scrollContentWidth = this.scrollContent.width + adsWidth;
        const scrollView = this.mainScroll;
        const adsWidget = this.bannerContainer.getComponent(cc.Widget);
        if (scrollContentWidth < this.center.width) {
            scrollView.enabled = false;
            this.scrollContent.position = cc.v3(-scrollContentWidth / 2 + adsWidth / 2, this.scrollContent.position.y);
            adsWidget.enabled = false;
            this.bannerContainer.position = cc.v3(-scrollContentWidth / 2 + adsWidth / 2, this.bannerContainer.position.y);
        } else {
            scrollView.enabled = true;
            adsWidget.enabled = true;
            scrollView.scrollTo(cc.v2(0, 0), 0);
        }
    }

    onBannerTypeChanged(e, param) {
        const type = +param;
        const showJackpot = type === 1;
        this.switchBanner(showJackpot, true);
    }

    outRoomGame() {
        //please dont remove this method, it's used in openGameRoom method in MiniPanel.ts file
        return new Promise<void>((resolve) => {
            socketIOController.closeMiniGameSockets();
            resolve();
        });
    }

    unAuthorized(data) {
        if (this.loading) {
            this.loading.active = false;
        }

        if (void 0 !== data["message"]) {
            this.showNotice({
                text: data.isSessionExpired || data.noPassword ? i18n.t("messages.sessionExpired") : i18n.t("messages.errorOccurred")
            });
        } else {
            this.showNotice(data);
        }
    }

    Authorized(Authorized) {
        this.getJackpotInfo();
    }

    serviceAuthorized(Authorized) {
        this.loading.active = false;

        if (!Authorized) {
            this.showSignName();
        } else {
            cc.RedT.callAuthentication();
            this.signIn();
        }
    }

    onData(data) {
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
            this.loadingComponent.onData(data.loading);
        }

        if (!!data.removeIsLoading && this.loading) {
            this.loading.active = false;
        }
    }

    handleUserData(user) {
        cc.RedT.userData(user);
        this.loadUserData(user);

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
    }

    formatUserCurrency(red, currency = null) {
        const splashConfig = new SplashConfig();

        if (splashConfig.enabledSC1) {
            let userCurrency = "";
            if (cc.RedT.user.currency) {
                userCurrency = cc.RedT.user.currency.toUpperCase();
            } else {
                userCurrency = currency ? currency : "";
            }

            return `${numberWithCommas(red, 2)} ${userCurrency}`;
        } else {
            return `${numberWithCommas(red, 2)}`;
        }
    }

    showNotice(noticeData: any, onClickButton: () => void = null, onClose: () => void = null) {
        cc.RedT.MiniPanel.showNotice(noticeData, onClickButton, onClose);
    }

    loadUserData(data: any) {
        if (void 0 !== data.red && this.header && this.header.userRed) {
            this.header.setBalance(this.formatUserCurrency(data.red, data.currency));
        }

        if (void 0 !== data.avatarId) {
            this.header.setAvatar(data.avatarId);
        }

        if (data.ss) {
            sessionManager.storeSessionData(data.ss);
        }

        if (void 0 !== data.name) {
            this.header.setUserName(data.name);
            sentryLogger.setCharacterName(data.name);
        }

        if (data.availSpins || data.scoins) {
            this.header.showScoins(data.scoins);
        }

        if (data.availSpins) {
            this.renderLuckyWheelIcon();
        }
    }

    signOut() {
        cc.RedT.user = {};
        cc.RedT.IS_LOGIN = false;
        this.AllReset();
        cc.sys.localStorage.removeItem("infoRed8");
        authManager.signOut();
    }

    onDisconnected() {
        this.AllReset();
        cc.sys.localStorage.removeItem("infoRed8");
    }

    signIn() {
        cc.RedT.IS_LOGIN = true;

        if (this.signName && this.signName.node) {
            const commonDialog = this.signName.dialogNode.getComponent(CommonDialog);
            commonDialog.closeDialog(false);
        }

        cc.RedT.MiniPanel && cc.RedT.MiniPanel.onSignIn();
        this.onSignIn();
        this.getJackpotInfo();
    }

    getJackpotInfo() {
        cc.RedT.send({
            jackpot: {
                getPools: true
            }
        });
    }

    openGameSSO() {
        if (window.openGameId) {
            const gameId = parseInt(window.openGameId);
            GameUtils.openGame(gameId, cc.RedT.MiniPanel, this.openLuckyWheel.bind(this));
            window.openGameId = null;
            sessionManager.removeInRoomGameId();
            return;
        }

        this.inRoomGameId = sessionManager.getInRoomGameId();
        if (this.inRoomGameId) {
            this.openInRoomGame(this.inRoomGameId);
        } else {
            window.isSSO && this.openLuckyWheel();
        }
    }

    openInRoomGame(gameId: string) {
        const info = SabaConfigs.GameInfos[gameId];
        if (info) {
            cc.RedT.MiniPanel.openNewSocketTableGame(null, +gameId);
        }
    }

    AllReset() {
        this.loading.active = false;
        this.newsContents.reset();
    }

    playMusic() {
        this.audioBG.play();
    }

    pauseMusic() {
        this.audioBG.pause();
    }

    audioClick() {
        AudioManager.getInstance().playClick();
    }

    onGameResultClick() {
        cc.RedT.MiniPanel.openResultPage();
    }

    renderLuckyWheelIcon() {
        return new Promise<void>((resolve) => {
            if (!this.luckyWheelIcon && cc.RedT.user.availSpins > 0) {
                GameUtils.loadResource(`games/lucky-wheel/LuckyWheelIcon`).then((prefab) => {
                    if (!this.luckyWheelIcon) {
                        const node = cc.instantiate(prefab);
                        this.redhat.insertChild(node, 0);
                        this.luckyWheelIcon = node.getComponent(LuckyWheelIcon);
                        this.luckyWheelIcon.init(cc.RedT.MiniPanel);
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    openLuckyWheel() {
        if (cc.RedT.user && cc.RedT.user.name) {
            this.renderLuckyWheelIcon().then(() => {
                this.luckyWheelIcon && cc.RedT.user.availSpins && this.luckyWheelIcon.openGame();
            });
        }
    }

    onCategoryChanged(e) {
        const category = e.node.name;
        AudioManager.getInstance().playClick();
        this.lobbyMenu.setCategory(+category);
        this.updateArrowVisibility();
    }

    showSignName() {
        if (!this.signName) {
            const node = cc.instantiate(this.signNamePrefab);
            this.signName = node.getComponent("SignName");
            this.signName.init(this.handleSignName.bind(this));
            cc.RedT.MiniPanel.addDialog(node);
        }
    }

    handleSignName(response) {
        if (response.authorized) {
            this.handleUserData(response.user);
        } else {
            const errorCode = response.errorCode;
            const text = NoticeUtil.getLocalizedErrorMessage(errorCode, { errorCode });
            this.showNotice({ text: text });
        }

        if (response.user) {
            cc.RedT.userData(response.user);
        }

        this.serviceAuthorized(response.authorized);
    }
}
