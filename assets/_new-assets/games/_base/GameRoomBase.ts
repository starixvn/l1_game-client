import GameBase, { GameState } from "./GameBase";
import RoomPlayer from "./RoomPlayer";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import { numberWithCommas } from '../../common/helpers/Helper';
import Notice from "../../common/notice/view-models/Notice";
import GameBasePlayerHandler from "./handlers/GameBasePlayerHandler";
import IGameBasePlayerHandler from "./handlers/GameBasePlayerHandler";
import GameUtils from "../../common/GameUtils";
import { GameBaseConfigs } from "./GameBaseConfig";
import UmWarning from "../../common/um-warning/UmWarning";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRoomBase extends GameBase {
    @property({ type: UmWarning, visible: false, override: true })
    umNotice: UmWarning = null;

    @property({ type: RoomPlayer })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node })
    otherPlayers: cc.Node = null;

    @property(cc.Prefab)
    miniPanelPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniPanelContainer: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    @property(cc.Node)
    loading: cc.Node = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userBalance: cc.Label = null;

    @property(cc.Sprite)
    userAvatar: cc.Sprite = null;

    @property(cc.Prefab)
    winningPlayerEffectPrefab: cc.Prefab = null;

    playerHandler: IGameBasePlayerHandler;
    private miniPanelScale: number;

    onLoad() {
        super.onLoad();
        cc.RedT.inGame = this;
        this.loadMiniPanel();
        this.loadUserData();
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.MiniPanel.destroy();
        cc.RedT.inGame = null;
    }

    init(gameName: string,
        gameConfigs: GameBaseConfigs,
        miniPanel: MiniPanel = null,
        miniPanelScale: number = 0.8) {

        super.init(gameName, gameConfigs, miniPanel);
        this.miniPanelScale = miniPanelScale;
    }

    initHandlers() {
        super.initHandlers();

        this.playerHandler = new GameBasePlayerHandler(this);
    }

    start() {
        cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }

    onConnected() {
        //dont do anything, go to MainGame if socket is disconnected.
    }

    onDisconnected() {
        this.closeGame();
    }

    onData(data: any) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);

        var gameData = data[this.gameName];

        if (gameData) {
            super.onData(gameData);
            this.onDataGameRoom(gameData);
        }
    }

    showUmMessage(data: any) {
        if (this.gameState == GameState.Stopped) {
            return;
        }

        const message = data.um_message;
        let text = message ? message : "Game đang được bảo trì, vui lòng quay lại sau 10 phút.";
        var noticeData = { text: text, button: { text: "Ok" } };
        var notice = this.showNotice(noticeData)

        var self = this;
        notice.handleClickButton = () => {
            self.closeGame();
        }
        notice.handleClose = () => {
            self.closeGame();
        }
    }

    showNotice(data): Notice {
        var noticePrefab = cc.instantiate(this.noticePrefab);
        var notice = noticePrefab.getComponent("Notice") as Notice;
        data.button = { text: 'Ok' };
        notice.init(data);
        this.node.addChild(noticePrefab);

        return notice;
    }

    closeGame() {
        if (this.loading) {
            this.loading.active = true;
        }

        this.stopGame();
        this.sendData({ outgame: true });
        cc.director.loadScene('MainGame');
    }

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.userAvatar.node.parent, false, bet, 1, 80);
    }

    showWinningBet(bet: number) {
        GameUtils.addFlyingText(this.userAvatar.node.parent, true, bet, 3, 80, 10);
    }

    protected onGameHide() {
        super.onGameHide();
        this.closeGame();
    }

    protected onDataGameRoomGeneral(data: any) {
        if (data.user) {
            this.userBalance.string = numberWithCommas(data.user.red);
            cc.RedT.userData(data.user);
        }

        if (data.kickedOut || data.apiError) {
            this.waitingProcessing = false;
            this.showProcessingWarning(false);
        }
    }

    protected onDataGameRoom(data: any) {
        if (this.players && this.players.length > 0) {
            this.playerHandler.handle(data);
        }
    }

    protected loadMiniPanel() {
        var miniPanel = cc.instantiate(this.miniPanelPrefab);
        this.currentMiniPanel = miniPanel.getComponent('MiniPanel');
        this.miniPanelContainer.addChild(miniPanel);

        if (!cc.sys.isMobile) {
            miniPanel.scale = this.miniPanelScale;
        }
    }

    protected loadUserData() {
        this.userName.string = cc.RedT.user.name;
        this.userBalance.string = numberWithCommas(cc.RedT.user.red);
        var self = this;

        cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
            if (self && self.userAvatar) {
                let avatarId = cc.RedT.user.avatarId;
                let frame = atlas.getSpriteFrame(avatarId == 0 ? 1 : avatarId);
                self.userAvatar.spriteFrame = frame;
            }
        });
    }
}
