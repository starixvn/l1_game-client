import { BundleManager } from "bundle-management";
import * as i18n from "i18n/runtime-scripts/LanguageData";

import { lazyInject } from "../../Application";
import AudioManager from "../../common/audio/AudioManager";
import NotificationService from "../../common/auth/NotificationService";
import UserService from "../../common/auth/UserService";
import BaseComponent from "../../common/BaseComponent";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import Loading from "../../common/loading/view-models/Loading";
import LoadWebView from "../../common/LoadWebView";
import Notice, { NoticeData } from "../../common/notice/view-models/Notice";
import ScaleActiveController from "../../common/scale-active-item/ScaleActiveController";
import NoticeUtil from "../../common/utils/NoticeUtil";
import { getGameId, isMiniGame, isUsingRemoteBundle } from "../../configs/GameConfigurations";
import CircleMenu from "../../lobby/main/view-models/CircleMenu";
import BoostedOdds, { BoostedOddsEvent } from "../../lobby/promotions/BoostedOdds";
import PromotionAnnouncements from "../../lobby/promotions/PromotionAnnouncements";
import { Promotions, PromotionsEvent } from "../../lobby/promotions/Promotions";
import { appManager } from "../../managers/AppManager";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import SocketIOController from "../../SocketIOController";
import * as authManager from "./../../common/auth/AuthManager";
import MiniPanelDataHandlers from "./MiniPanelDataHandlers";
import MiniPanelMiniGameInitializers from "./MiniPanelMiniGameInitializers";
import MiniPanelSocketIOGameInitializers from "./MiniPanelSocketIOGameInitializers";
import PopupMinigames from "./popup/PopupMinigames";

type NewLayerCallback = () => void;

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniPanel extends BaseComponent {
    @property(cc.BitmapFont)
    fontCong: cc.BitmapFont = null;

    @property(cc.BitmapFont)
    fontTru: cc.BitmapFont = null;

    @property(cc.Node)
    miniGames: cc.Node = null;

    @property(cc.Node)
    miniMenu: cc.Node = null;

    @property(cc.Node)
    dialog: cc.Node = null;

    @property(cc.Node)
    effectNode: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    loadingPrefab: cc.Prefab = null;

    @property(cc.Node)
    noticeContainer: cc.Node = null;

    @property(cc.Node)
    guideContainer: cc.Node = null;

    @property(ScaleActiveController)
    activeController: ScaleActiveController = null;

    @property(cc.Prefab)
    announcementPrefab: cc.Prefab = null;

    @property(cc.Node)
    promotionContainer: cc.Node = null;

    public popupMiniGame: PopupMinigames;
    public loading: Loading;
    public dataHandlers: MiniPanelDataHandlers;
    public currentGameRoomId: number;
    public skipShowApiErrorGameIds: number[] = [];
    public gameMiniInitializers: MiniPanelMiniGameInitializers;
    public socketIOGameInitializers: MiniPanelSocketIOGameInitializers;
    private miniGamesCache = {};
    private newLayerCallbacks = {};
    public chartsWebView = {};
    private readonly kickedOutKey = "kickedOut";
    private readonly reloadKey = "reload";
    private readonly authKey = "auth";
    public boostedOdds: BoostedOdds;
    public promotionAnnouncement: PromotionAnnouncements;

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    addNewLayerCallback(key: string, callback: NewLayerCallback) {
        this.newLayerCallbacks[key] = callback;
    }

    removeNewLayerCallback(key: string) {
        delete this.newLayerCallbacks[key];
    }

    removeChartsWebView(key: string) {
        delete this.chartsWebView[key];
    }

    onGamesLayerChanged() {
        Object.values(this.newLayerCallbacks).forEach((callback: NewLayerCallback) => callback());
    }

    onLoad() {
        appManager.font.increaseMoney = this.fontCong;
        appManager.font.decreaseMoney = this.fontTru;

        const loadingNode = cc.instantiate(this.loadingPrefab);
        this.loading = loadingNode.getComponent("Loading") as Loading;
        loadingNode.active = false;
        this.node.addChild(loadingNode);
        this.dataHandlers = new MiniPanelDataHandlers(this);
        this.gameMiniInitializers = new MiniPanelMiniGameInitializers(this);
        this.socketIOGameInitializers = new MiniPanelSocketIOGameInitializers(this);

        this.initPopUpMiniGames();
        this.initBoostedOdds();

        this.miniGames.on(cc.Node.EventType.CHILD_ADDED, this.onGamesLayerChanged.bind(this));
        this.miniGames.on(cc.Node.EventType.CHILD_REMOVED, this.onGamesLayerChanged.bind(this));
        this.miniGames.on(cc.Node.EventType.CHILD_REORDER, this.onGamesLayerChanged.bind(this));
        this.noticeContainer.on(cc.Node.EventType.CHILD_ADDED, this.onGamesLayerChanged.bind(this));
        this.noticeContainer.on(cc.Node.EventType.CHILD_REMOVED, this.onGamesLayerChanged.bind(this));
        this.guideContainer.on(cc.Node.EventType.CHILD_ADDED, this.onGamesLayerChanged.bind(this));
        this.guideContainer.on(cc.Node.EventType.CHILD_REMOVED, this.onGamesLayerChanged.bind(this));
        this.dialog.on(cc.Node.EventType.CHILD_ADDED, this.onGamesLayerChanged.bind(this));
        this.dialog.on(cc.Node.EventType.CHILD_REMOVED, this.onGamesLayerChanged.bind(this));

        NotificationService.getInstance().addDataObserver(this.kickedOutKey, this.kickedOutKey, (data) =>
            this.dataHandlers.handleDataKickedOut(data)
        );
        NotificationService.getInstance().addDataObserver(this.authKey, this.authKey, (data) => this.dataHandlers.handleAuth(data));
        NotificationService.getInstance().addDataObserver(this.reloadKey, this.reloadKey, this.onForceReload.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.kickedOutKey, this.kickedOutKey);
        NotificationService.getInstance().removeDataObserver(this.authKey, this.authKey);
        NotificationService.getInstance().removeDataObserver(this.reloadKey, this.reloadKey);
    }

    initPopUpMiniGames() {
        GameUtils.loadResource(`minipanel/popup-mini-game/PopUpMiniGame`)
            .then((prefab) => {
                const popUpMiniGameNode = cc.instantiate(prefab);
                this.popupMiniGame = popUpMiniGameNode.getComponent(PopupMinigames);
                if (this.popupMiniGame) {
                    const backgroundPopUpMiniGameNode = this.miniMenu.getChildByName("frame");
                    const clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = popUpMiniGameNode;
                    clickEventHandler.component = "PopupMinigames";
                    clickEventHandler.handler = "toggle";
                    backgroundPopUpMiniGameNode.getComponent(cc.Button).clickEvents.push(clickEventHandler);
                    this.popupMiniGame.background = backgroundPopUpMiniGameNode;
                    this.popupMiniGame.background.opacity = 0;
                }
                const gameMenu = popUpMiniGameNode.getChildByName("list")?.getComponent(CircleMenu);
                if (gameMenu) {
                    gameMenu.miniPanel = this;
                }
                this.miniMenu.addChild(popUpMiniGameNode);
            })
            .catch((err) => console.warn("Failed to init mini game icons - " + err));
    }

    initBoostedOdds() {
        GameUtils.loadResource(`boosted-odds/BoostedOdds`).then((prefab) => {
            const boostedOddsNode = cc.instantiate(prefab);
            this.boostedOdds = boostedOddsNode.getComponent(BoostedOdds);
            boostedOddsNode.on(BoostedOddsEvent.SHOW_PROMOTION_ANNOUNCEMENT, this.showAnnouncement.bind(this));
            Promotions.getInstance().on(PromotionsEvent.SHOW_BOOSTED_ODDS, () => this.boostedOdds?.handleBoostedOdds());

            boostedOddsNode && this.promotionContainer.addChild(boostedOddsNode);
        });
    }

    onGeneralData(data: any) {
        if (!this.dataHandlers) {
            this.dataHandlers = new MiniPanelDataHandlers(this);
        }

        this.dataHandlers.handleData(data);
    }

    handleUmMessage(data, gameId) {
        this.setLoadingVisibility(false);
        const text = NoticeUtil.getMessageByLocale(data);
        if (text) {
            const noticeData = {
                text: text,
                isInfo: false
            } as NoticeData;
            this.showNotice(noticeData);
        }

        this.unCacheAndHideGameLoading(this.getGameLoadingComp(gameId), gameId);
        this.handleWhenNotJoinRoomGame(gameId);
    }

    handleWhenNotJoinRoomGame(gameId) {
        uiManager.emitter.emit(InternalEvents.LOAD_OTHER_ICONS_AND_BANNERS);
    }

    redirectToResultPage(redirectUrl) {
        appManager.resultPage = window.open(redirectUrl, "", "width=700,height=500");
        if (appManager.resultPage) {
            appManager.resultPage.focus();
            window.onbeforeunload = function () {
                appManager.resultPage?.close();
            };
        }
    }

    openResultPage(gameId: number = undefined) {
        UserService.getGameResultUrl(gameId).then((url) => {
            this.redirectToResultPage(url);
        });
    }

    addMiniGame(game: any, gameId: number) {
        if (gameId === -1) {
            //lucky wheel, so add to dialogNode
            this.addDialog(game.node);
        } else {
            this.miniGames && this.miniGames.addChild(game.node);
            this.miniGamesCache[gameId] = game;

            this.activeController.addItem(game.node);
        }
    }

    getGameMini(gameId): any {
        return this.miniGamesCache[gameId];
    }

    onSignIn() {
        Object.keys(this.miniGamesCache).forEach((key) => {
            const game = this.miniGamesCache[key];
            if (game && game.node && game.node.isValid) {
                game.onSignIn();
            }
        });
    }

    onForceReload(showNotice = true, message = i18n.t("messages.newUpdateAvailable")) {
        const forceReload = () => {
            location.reload();
        };

        if (showNotice) {
            const noticeData = {
                text: message,
                isInfo: true
            } as NoticeData;
            this.showNotice(noticeData, forceReload, forceReload);
        } else {
            forceReload();
        }
    }

    forceKickedOut() {
        NotificationService.getInstance().forceKickedOut();
        authManager.signOut();
    }

    playClick() {
        AudioManager.getInstance().playClick();
    }

    openGame(e, id) {
        this.loadGame(id, () => {
            this.gameMiniInitializers.openGame(id);
        });
    }

    openMiniContainerGame(id) {
        this.loadGame(id, () => {
            this.gameMiniInitializers.openMiniContainerGame(id);
        });
    }

    openNewSocketMiniGame(e, id) {
        uiManager.setCurrentGameId(id);
        this.loadGame(id, () => {
            this.gameMiniInitializers.openNewSocket(id);
            Object.values(this.chartsWebView).forEach((chartWebView: LoadWebView) => {
                chartWebView && chartWebView.hideWebView();
            });
        });
    }

    openNewSocketTableGame(event, gameId) {
        uiManager.setCurrentGameId(gameId);
        this.loadGame(gameId, () => {
            this.socketIOGameInitializers.openGame(gameId);
        });
    }

    loadGame(gameId, onComplete: () => void) {
        const loading = this.getGameLoadingComp(gameId);
        loading.setLoadingVisibility(true);

        const language = window.i18n.curLang;

        if (isUsingRemoteBundle(gameId)) {
            const path = `i18n/images/${language}`;
            const preloadPath = `preload`;
            BundleManager.getInstance()
                .loadBundle(`${gameId}`)
                .then((bundle: cc.AssetManager.Bundle) => {
                    bundle.loadDir(preloadPath, (errors, assets) => {
                        bundle.loadDir(path, cc.SpriteFrame, null, onComplete);
                    });
                })
                .catch(onComplete);
        } else {
            cc.resources.loadDir(`image/${language}/${gameId}`, cc.SpriteFrame, null, onComplete);
        }
    }

    openSocketByUrl(gameId, socketUri, onConnectCallback) {
        const socket = this.socketIOController.createSocketByUrl(gameId, socketUri);
        this.socketIOController.initBaseListenersForSocketUrl(socket, gameId, this.onConnectSocketFailed.bind(this), onConnectCallback);
        this.socketIOGameInitializers.handleSocket(socket, gameId);
        return socket;
    }

    loadGameRoom(name) {
        const gameId = getGameId(name);

        if (uiManager.getCurrentGameId() !== +gameId || isMiniGame(name)) {
            return;
        }

        const gameLoading = this.getGameLoadingComp(+gameId);
        gameLoading && gameLoading.setDefaultPercent();

        cc.director.preloadScene(
            name,
            (completedCount, total, item) => {
                if (uiManager.getCurrentGameId() !== +gameId) {
                    this.unCacheAndHideGameLoading(gameLoading, +gameId);
                    return;
                }
                gameLoading && gameLoading.onProgress(completedCount, total, item);
            },
            (error) => {
                const loadingFromManager = uiManager.getLoadingWithGameID(+gameId);
                loadingFromManager && this.unCacheAndHideGameLoading(gameLoading, +gameId);

                if (error) {
                    this.onForceReload();
                } else {
                    uiManager.getCurrentGameId() === +gameId && cc.director.loadScene(name);
                }
            }
        );
    }

    showAnnouncement() {
        const node = cc.instantiate(this.announcementPrefab);
        this.promotionAnnouncement = node.getComponent(PromotionAnnouncements);
        if (this.promotionAnnouncement) {
            this.promotionAnnouncement.miniPanel = this;
        }

        this.addDialog(node);
    }

    showErrorNotice(error): Notice {
        if (!this.node.activeInHierarchy) {
            return null;
        }
        const node = cc.instantiate(this.noticePrefab);
        const notice = node.getComponent(Notice);

        const gameName = GameUtils.getGameNameString(error.gameTypeId);
        const { minBet, maxBet, gameRoundId, errorCode } = error;
        const opt = { gameName, gameRoundId, errorCode, minBet: numberWithCommas(minBet), maxBet: numberWithCommas(maxBet) };
        const isPlaceBet = error.isPlaceBetFailed;
        const message = NoticeUtil.getLocalizedErrorMessage(errorCode, opt, isPlaceBet);

        notice.init({ text: message } as NoticeData);
        this.addNotice(node);

        return notice;
    }

    addNotice(node: cc.Node) {
        this.noticeContainer.addChild(node);
    }

    showGuide(guide: cc.Node) {
        this.guideContainer.addChild(guide);
    }

    showNotice(noticeData: NoticeData, handleClickButton: () => void = null, handleClose: () => void = null) {
        if (!this.node.activeInHierarchy) {
            return;
        }
        const node = cc.instantiate(this.noticePrefab);
        const notice = node.getComponent(Notice);

        noticeData.button = { text: "OK" };
        notice.init(noticeData);

        if (handleClickButton) {
            notice.handleClickButton = handleClickButton;
        }

        if (handleClose) {
            notice.handleClose = handleClose;
        }

        this.addNotice(node);
    }

    onConnectSocketFailed(gameName, gameId, isGameRoom = true) {
        if (!this.isAlive()) {
            return;
        }
        const handleCloseNotice = () => isGameRoom && this.redirectToLobby();

        this.showNotice(
            {
                text: i18n.t("messages.lostGameConnection", { gameName: gameName })
            } as NoticeData,
            handleCloseNotice,
            handleCloseNotice
        );

        this.setLoadingVisibility(false);
        this.unCacheAndHideGameLoading(this.getGameLoadingComp(gameId), gameId);
        this.handleWhenNotJoinRoomGame(gameId);
    }

    redirectToLobby() {
        const currentSceneName = cc.director.getScene().name;
        if (currentSceneName !== "Lobby") {
            if (appManager.isDirectMode) {
                appManager.backToOperatorLobby();
            } else {
                cc.director.loadScene("Lobby");
            }
        }
    }

    addDialog(dialogNode: cc.Node) {
        this.dialog.addChild(dialogNode);
    }

    setIconOverMiniGame(over: boolean) {
        this.miniMenu.setSiblingIndex(over ? 1 : 0);
        this.miniGames.setSiblingIndex(!over ? 1 : 0);
    }

    setLoadingVisibility(status: boolean) {
        this.loading && this.loading.setLoadingVisibility(status);
    }

    unCacheAndHideGameLoading(loadingComp: Loading, gameId: number) {
        loadingComp && loadingComp.setLoadingVisibility(false);
        uiManager.unCacheIconLoading(gameId);
    }

    getGameLoadingComp(gameId: number): Loading {
        const loadingFromManager = uiManager.getLoadingWithGameID(gameId);
        return loadingFromManager ? loadingFromManager : this.loading;
    }
}
