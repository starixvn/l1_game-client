import * as i18n from "i18n/runtime-scripts/LanguageData";

import { appContainer } from "../../../Application";
import * as baseControl from "../../../BaseController";
import AudioManager from "../../../common/audio/AudioManager";
import MusicPlayer from "../../../common/audio/MusicPlayer";
import NotificationService from "../../../common/auth/NotificationService";
import UserService from "../../../common/auth/UserService";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import logger from "../../../common/logger";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import LuckyWheelIcon from "../../../games/lucky-wheel/view-models/LuckyWheelIcon";
import LobbyMenuConfig from "../../../lobby/main/view-models/LobbyMenuConfig";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import SocketIOController from "../../../SocketIOController";
import SplashConfig from "../../../splash/view-models/SplashConfig";
import NewsContent from "../../news/NewsContent";
import CommonDialog from "./../../../common/_base/view-models/CommonDialog";
import * as authManager from "./../../../common/auth/AuthManager";
import * as sessionManager from "./../../../common/auth/SessionManager";
import Banner from "./Banner";
import CategoryItem from "./CategoryItem";
import Header from "./Header";
import LobbyMenu, { GameCategory } from "./LobbyMenu";

const socketIOController = appContainer.get(SocketIOController);
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

    @property(Banner)
    banner: Banner = null;

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
    private luckyWheelIcon: LuckyWheelIcon;
    private lobbyMenu: LobbyMenu;
    private miniPanel: MiniPanel;
    signName: any;
    private miniPanel: MiniPanel;

    onDestroy() {
        cc.RedT.MiniPanel = null;
        cc.RedT.inGame = null;
        window.isSSO = false;
    }

    onLoad() {
        document.cookie = "redT=1702;path=/";

        this.initRedT();
        cc.RedT.inGame = this;
        this.initAppEvent();

        NotificationService.getInstance().connect();

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
        const categoryList = {
            seDieGames: GameCategory.SeDie,
            casinoGames: GameCategory.Casino,
            cardGames: GameCategory.Card,
            slotGames: GameCategory.Slot,
            lotteryGames: GameCategory.Lottery,
            othersGames: GameCategory.Other
        };

        Object.keys(categoryList).forEach((key) => {
            const isNew = lobbyMenuConfig.categoryList[key].some(
                (gameId) => lobbyMenuConfig.isNewGame(gameId) && cc.RedT.user?.offerGames?.includes(gameId)
            );
            const categoryNode = this.categoryContainer.children.find((child) => child.name === categoryList[key].toString());
            if (categoryNode) {
                const newNode = categoryNode.getComponent(CategoryItem);
                newNode.newNode.active = isNew;
            }
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
                UserService.getBalance();
            }.bind(this)
        );
    }

    initMiniPanel() {
        const miniPanelNode = cc.instantiate(this.miniPanelPrefab);
        this.miniPanel = miniPanelNode.getComponent(MiniPanel);
        cc.RedT.MiniPanel = this.miniPanel;
        this.redhat.insertChild(miniPanelNode, 1);
    }

    callTriggerSignIn() {
        if (authManager && !cc.RedT.IS_LOGIN) {
            authManager.triggerSignIn(this);
        }
    }

    onLoadLobby() {
        if (cc.RedT.IS_LOGIN) {
            this.onSignIn();
            this.header.setUserName(cc.RedT.user.name);
            this.header.setBalance(this.formatUserCurrency(cc.RedT.user.red));
            this.header.setAvatar(cc.RedT.user.avatarId);
            (cc.RedT.user.availSpins || cc.RedT.user.scoins) && this.header.showScoins(cc.RedT.user.scoins);

            this.renderLuckyWheelIcon();
        }
    }

    onSignIn() {
        if (window.openGameId || sessionManager.getInRoomGameId()) {
            this.openGameSSO();
            window.isSSO && this.setCategoryOnSSOGame();
        } else {
            this.loadLobby();
            window.isSSO && this.openLuckyWheel();
        }
    }

    setCategoryOnSSOGame() {
        this.initLobbyMenu();
        const category = GameCategory.All;
        this.lobbyMenu?.setCategory(category, false);
    }

    loadLobby() {
        if (!this.initializedLobby) {
            this.initLobby();
        }
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
        this.initCategory();
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
        lobbyMenu.miniPanel = this.miniPanel;

        this.lobbyMenu = lobbyMenu;
    }

    initCategory() {
        let category = GameCategory.All;
        if (!window.isSSO) {
            category = this.activeCategoryFromStorage();
        }
        this.activeBgNewOnCategory();
        this.lobbyMenu?.setCategory(category);
    }

    private initBanners() {
        GameUtils.loadResource(`lobby/banner/bannerContainer`).then(async (prefab) => {
            this.banner.handleBanner(prefab);
        });
    }

    outRoomGame() {
        //please dont remove this method, it's used in openGameRoom method in MiniPanel.ts file
        return new Promise<void>((resolve) => {
            socketIOController.closeMiniGameSockets();
            resolve();
        });
    }

    serviceAuthorized(Authorized) {
        this.loading.active = false;

        if (!Authorized) {
            this.showSignName();
        } else {
            this.signIn();
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
        this.miniPanel.showNotice(noticeData, onClickButton, onClose);
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

        this.miniPanel && this.miniPanel.onSignIn();
        this.onSignIn();
    }

    openGameSSO() {
        this.miniPanel.setData(this);
        if (window.openGameId) {
            const gameId = parseInt(window.openGameId);
            cc.sys.localStorage.setItem(`CASCADING_SLOT_BET_CONTROL`, "");
            GameUtils.openGame(gameId, this.miniPanel, this.openLuckyWheel.bind(this), this.loadLobby.bind(this));
            window.openGameId = null;
            sessionManager.removeInRoomGameId();
            return;
        }

        this.inRoomGameId = sessionManager.getInRoomGameId();
        if (this.inRoomGameId) {
            GameUtils.openGame(+this.inRoomGameId, this.miniPanel, null);
        } else {
            window.isSSO && this.openLuckyWheel();
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
        this.miniPanel.openResultPage();
    }

    renderLuckyWheelIcon() {
        return new Promise<void>((resolve) => {
            if (!this.luckyWheelIcon && cc.RedT.user.availSpins > 0) {
                GameUtils.loadResource(`games/lucky-wheel/LuckyWheelIcon`).then((prefab) => {
                    if (!this.luckyWheelIcon) {
                        const node = cc.instantiate(prefab);
                        this.redhat.insertChild(node, 0);
                        this.luckyWheelIcon = node.getComponent(LuckyWheelIcon);
                        this.luckyWheelIcon.init(this.miniPanel);
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
            this.miniPanel.addDialog(node);
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
