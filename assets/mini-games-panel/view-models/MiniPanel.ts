import * as i18n from "i18n/runtime-scripts/LanguageData";

import AudioManager from "../../common/audio/AudioManager";
import * as sessionManager from "../../common/auth/SessionManager";
import BaseComponent from "../../common/BaseComponent";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import Loading from "../../common/loading/view-models/Loading";
import LoadWebView from "../../common/LoadWebView";
import Notice, { NoticeData } from "../../common/notice/view-models/Notice";
import ScaleActiveController from "../../common/scale-active-item/ScaleActiveController";
import NoticeUtil from "../../common/utils/NoticeUtil";
import GameIconMenu from "../../lobby/main/view-models/GameIconMenu";
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

    @property(GameIconMenu)
    gameMenu: GameIconMenu = null;

    @property(cc.Node)
    noticeContainer: cc.Node = null;

    @property(cc.Node)
    guideContainer: cc.Node = null;

    @property(ScaleActiveController)
    activeController: ScaleActiveController = null;

    public popupMiniGame: any;
    public loading: Loading;
    public dataHandlers: MiniPanelDataHandlers;
    public currentGameRoomId: number;
    public skipShowApiErrorGameIds: number[] = [];
    public gameMiniInitializers: MiniPanelMiniGameInitializers;
    private socketIOGameInitializers: MiniPanelSocketIOGameInitializers;
    private miniGamesCache = {};
    private newLayerCallbacks = {};
    public chartsWebView = {};

    addNewLayerCallback(key: string, callback: NewLayerCallback) {
        this.newLayerCallbacks[key] = callback;
    }

    removeNewLayerCallback(key: string) {
        delete this.newLayerCallbacks[key];
    }

    removeChartsWebView(key: string) {
        delete this.chartsWebView[key];
    }

    onNewLayerCallback() {
        Object.values(this.newLayerCallbacks).forEach((callback: NewLayerCallback) => callback());
    }

    onLoad() {
        if (void 0 === cc.RedT.util.fontCong) {
            cc.RedT.util.fontCong = this.fontCong;
            cc.RedT.util.fontTru = this.fontTru;
        }

        const loadingNode = cc.instantiate(this.loadingPrefab);
        this.loading = loadingNode.getComponent("Loading") as Loading;
        loadingNode.active = false;
        this.node.addChild(loadingNode);

        this.popupMiniGame = this.miniMenu.getComponent(PopupMinigames);
        this.dataHandlers = new MiniPanelDataHandlers(this);
        this.gameMiniInitializers = new MiniPanelMiniGameInitializers(this);
        this.socketIOGameInitializers = new MiniPanelSocketIOGameInitializers(this);
        this.gameMenu.miniPanel = this;

        this.miniGames.on(cc.Node.EventType.CHILD_ADDED, this.onNewLayerCallback.bind(this));
        this.miniGames.on(cc.Node.EventType.CHILD_REMOVED, this.onNewLayerCallback.bind(this));
        this.miniGames.on(cc.Node.EventType.CHILD_REORDER, this.onNewLayerCallback.bind(this));
        this.noticeContainer.on(cc.Node.EventType.CHILD_ADDED, this.onNewLayerCallback.bind(this));
        this.noticeContainer.on(cc.Node.EventType.CHILD_REMOVED, this.onNewLayerCallback.bind(this));
        this.guideContainer.on(cc.Node.EventType.CHILD_ADDED, this.onNewLayerCallback.bind(this));
        this.guideContainer.on(cc.Node.EventType.CHILD_REMOVED, this.onNewLayerCallback.bind(this));
        this.dialog.on(cc.Node.EventType.CHILD_ADDED, this.onNewLayerCallback.bind(this));
        this.dialog.on(cc.Node.EventType.CHILD_REMOVED, this.onNewLayerCallback.bind(this));
    }

    onGeneralData(data: any) {
        if (!this.dataHandlers) {
            this.dataHandlers = new MiniPanelDataHandlers(this);
        }

        this.dataHandlers.handleData(data);
        // open result page
        if (data.gameResult) {
            const { redirectUrl } = data.gameResult;
            this.redirectToResultPage(redirectUrl);
        }
    }

    handleUmMessage(data) {
        this.loading.node.active = false;
        const text = NoticeUtil.getMessageByLocale(data);
        if (text) {
            const noticeData = {
                text: text,
                isInfo: false
            } as NoticeData;
            this.showNotice(noticeData);
        }
    }

    redirectToResultPage(redirectUrl) {
        cc.RedT.resultPage = window.open(redirectUrl, "", "width=700,height=500");
        if (cc.RedT.resultPage) {
            cc.RedT.resultPage.focus();

            window.onbeforeunload = function () {
                cc.RedT.resultPage.close();
            };
        }
    }

    openResultPage(gameId: number = undefined) {
        const data = { language: sessionManager.getLocale() };
        if (gameId) {
            data["gameId"] = gameId;
        }
        cc.RedT.send({ gameResult: data });
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
        cc.RedT.forceKickedOut();
        authManager.signOut();
    }

    playClick() {
        AudioManager.getInstance().playClick();
    }

    openGame(e, id) {
        cc.resources.loadDir(`image/${window.i18n.curLang}/${id}`, cc.Texture2D, null, () => {
            this.gameMiniInitializers.openGame(id);
        });
    }

    openMiniContainerGame(id) {
        cc.resources.loadDir(`image/${window.i18n.curLang}/${id}`, cc.Texture2D, null, () => {
            this.gameMiniInitializers.openMiniContainerGame(id);
        });
    }

    openNewSocketMiniGame(e, id) {
        cc.resources.loadDir(`image/${window.i18n.curLang}/${id}`, cc.Texture2D, null, () => {
            this.gameMiniInitializers.openNewSocket(id);
            Object.values(this.chartsWebView).forEach((chartWebView: LoadWebView) => {
                chartWebView && chartWebView.hideWebView();
            });
        });
    }

    openNewSocketTableGame(event, gameId) {
        cc.resources.loadDir(`image/${window.i18n.curLang}/${gameId}`, cc.Texture2D, null, () => {
            this.socketIOGameInitializers.openGame(gameId);
        });
    }

    loadGameRoom(name) {
        this.loading.setDefaultPercent();

        cc.director.preloadScene(
            name,
            (completedCount, total, item) => {
                this.loading && this.loading.onProgress(completedCount, total, item);
            },
            (error) => {
                if (error) {
                    this.loading.node.active = false;
                    this.onForceReload();
                } else {
                    cc.director.loadScene(name);
                }
            }
        );
    }

    showErrorNotice(error): Notice {
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

    onConnectSocketFailed(gameName, isGameRoom = true) {
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
        this.loading.node.active = false;
    }

    redirectToLobby() {
        const currentSceneName = cc.director.getScene().name;

        currentSceneName !== "MainGame" && cc.director.loadScene("MainGame");
    }

    addDialog(dialogNode: cc.Node) {
        this.dialog.addChild(dialogNode);
    }

    setIconOverMiniGame(over: boolean) {
        this.miniMenu.getParent().setSiblingIndex(over ? 1 : 0);
        this.miniGames.setSiblingIndex(!over ? 1 : 0);
    }
}
