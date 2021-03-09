import * as sessionManager from '../../common/auth/SessionManager';
import GameUtils from '../../common/GameUtils';
import Loading from '../../common/loading/view-models/Loading';
import Notice, { NoticeData } from '../../common/notice/view-models/Notice';
import * as SabaConfigs from '../../configs/SabaConfigs';
import GameBase from '../../games/_base/GameBase';
import GameIconMenu from '../../lobby/main/view-models/GameIconMenu';
import * as authManager from './../../common/auth/AuthManager';
import MiniPanelDataHandlers from './MiniPanelDataHandlers';
import MiniPanelMiniGameInitializers from './MiniPanelMiniGameInitializers';
import MiniPanelSocketIOGameInitializers from './MiniPanelSocketIOGameInitializers';
import PopupMinigames from './popup/PopupMinigames';

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniPanel extends cc.Component {
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

    public popupMiniGame: any;
    public loading: Loading;
    public dataHandlers: MiniPanelDataHandlers;
    public currentGameRoomId: number;
    public skipShowApiErrorGameIds: number[] = [];
    private gameMiniInitializers: MiniPanelMiniGameInitializers;
    private socketIOGameInitializers: MiniPanelSocketIOGameInitializers;
    private miniGamesCache = {};

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
    }

    onGeneralData(data: any) {
        if (!this.dataHandlers) {
            this.dataHandlers = new MiniPanelDataHandlers(this);
        }

        this.dataHandlers.handleData(data);
    }

    addMiniGame(game: GameBase, gameId: number) {
        this.miniGames && this.miniGames.addChild(game.node);
        this.miniGamesCache[gameId] = game;
    }

    getGameMini(gameId): GameBase {
        return this.miniGamesCache[gameId];
    }

    onSignIn() {
        Object.keys(this.miniGamesCache).forEach((key) => this.miniGamesCache[key].onSignIn());
    }

    onForceReload(showNotice = true, message = "Vui lòng tải lại trang để cập nhật phiên bản mới.") {
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
        cc.RedT.audio.playClick();
    }

    playUnClick() {
        cc.RedT.audio.playUnClick();
    }

    openGame(e, id) {
        this.gameMiniInitializers.openGame(id);
    }

    openNewSocketMiniGame(e, id) {
        this.gameMiniInitializers.openNewSocket(id);
    }

    openGameRoom(e, id) {
        this.popupMiniGame.hideListGame();

        if (this.currentGameRoomId === id) {
            return;
        }

        sessionManager.removeInRoomGameId();

        if (!cc.RedT.isConnected) {
            const gameName = GameUtils.getGameNameString(id);
            this.onConnectSocketFailed(gameName);
            return;
        }

        if (cc.RedT.IS_LOGIN) {
            const regName = SabaConfigs.gameRoomRegNames[id];
            this.loading.node.active = true;
            cc.RedT.inGame.outRoomGame().then(() => {
                cc.RedT.send({ g: { reg: regName } });
            });
        } else {
            this.forceKickedOut();
        }
    }

    openNewGameSocket(event, gameId) {
        this.socketIOGameInitializers.openGame(gameId);
    }

    loadGameRoom(name) {
        this.loading.setDefaultPercent();

        cc.director.preloadScene(
            name,
            (completedCount, total, item) => {
                this.loading && this.loading.onProgress(completedCount, total, item);
            },
            (error, assets) => {
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
        const noticePrefab = cc.instantiate(this.noticePrefab);
        const notice = noticePrefab.getComponent(Notice);
        let message = "";

        if (error.gameTypeId) {
            const gameName = GameUtils.getGameNameString(error.gameTypeId);
            message += `Game ${gameName} (#${error.gameRoundId})\r\n`;
        }

        message += `${error.message}.`;

        if (error.isPlaceBetFailed) {
            message += " Đặt cược thất bại!";
        }

        notice.init({ text: message } as NoticeData);
        this.node.addChild(noticePrefab);

        return notice;
    }

    showNotice(noticeData: NoticeData, handleClickButton = null, handleClose = null) {
        const noticePrefab = cc.instantiate(this.noticePrefab);
        const notice = noticePrefab.getComponent("Notice") as Notice;

        noticeData.button = { text: "OK" };
        notice.init(noticeData);

        if (handleClickButton) {
            notice.handleClickButton = handleClickButton;
        }

        if (handleClose) {
            notice.handleClose = handleClose;
        }

        this.node.addChild(noticePrefab);
    }

    onConnectSocketFailed(gameName, isGameRoom = true) {
        if (!this.node || !this.node.isValid) {
            return;
        }
        const handleCloseNotice = () => isGameRoom && this.redirectToLobby();

        this.showNotice(
            {
                text: `${gameName}\nMất kết nối hoặc kết nối không ổn định. Vui lòng kiểm tra và thử lại.`
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
}
