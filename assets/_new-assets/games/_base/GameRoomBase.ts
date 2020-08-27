import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/Helper";
import Notice, { NoticeData } from "../../common/notice/view-models/Notice";
import UmWarning from "../../common/um-warning/UmWarning";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import GameBase from "./GameBase";
import { GameBaseConfigs } from "./GameBaseConfig";
import { GameBasePlayerHandler } from "./handlers/GameBasePlayerHandler";
import RoomPlayer from "./RoomPlayer";

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

    playerHandler: GameBasePlayerHandler;
    private miniPanelScale: number;
    protected gameId: number;

    onLoad() {
        super.onLoad();
        cc.RedT.inGame = this;
        this.loadMiniPanel();
        this.loadUserData(cc.RedT.user);
        this.players.forEach(player => player.node.active = false);
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.inGame = null;
    }

    init(gameName: string,
        gameConfigs: GameBaseConfigs,
        miniPanel: MiniPanel = null,
        miniPanelScale: number = 1,
        gameId: number = 0) {

        super.init(gameName, gameConfigs, miniPanel);
        this.miniPanelScale = miniPanelScale;
        this.gameId = gameId;
    }

    initHandlers() {
        super.initHandlers();

        this.playerHandler = new GameBasePlayerHandler(this);
    }

    start() {
        cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }

    onDisconnected() {
        this.closeGame();
    }

    onData(data: any) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);

        var gameData = data[this.gameName];

        if (gameData) {
            this.onDataGameRoom(gameData);
        }
    }

    showUmMessage(data: any) {
        if (this.isDisableGame) {
            return;
        }

        const message = data.um_message;
        let text = message ? message : "Game đang được bảo trì, vui lòng quay lại sau 10 phút.";
        var noticeData = <NoticeData>{ text: text, button: { text: "OK" } };
        var notice = this.showNotice(noticeData)

        var self = this;
        notice.handleClickButton = () => {
            self.closeGame();
        }
        notice.handleClose = () => {
            self.closeGame();
        }
    }

    showNotice(data: NoticeData): Notice {
        var noticePrefab = cc.instantiate(this.noticePrefab);
        var notice = noticePrefab.getComponent("Notice") as Notice;
        data.button = { text: 'OK' };
        notice.init(data);
        this.miniPanelContainer.addChild(noticePrefab);

        return notice;
    }

    closeGame() {
        if (this.loading) {
            this.loading.active = true;
        }
        this.outRoomGame().then(() => {
            cc.director.loadScene('MainGame');
        });
    }

    public outRoomGame() {
        return new Promise((resolve, reject) => {
            this.sendData({ outgame: true });
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.stopGame();
                    resolve();
                })));
        });
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
            this.loadUserData(data.user);
            cc.RedT.userData(data.user);
        }

        if (data.kickedOut || data.apiError) {
            this.waitingProcessing = false;
            this.showProcessingWarning(false);
        }
    }


    protected onDataGameRoom(data: any) {
        super.onData(data);

        if (this.players && this.players.length > 0) {
            this.playerHandler.handle(data);
        }
    }

    protected loadMiniPanel() {
        var miniPanel = cc.instantiate(this.miniPanelPrefab);
        this.currentMiniPanel = miniPanel.getComponent('MiniPanel');
        this.currentMiniPanel.currentGameRoomId = this.gameId;
        this.miniPanelContainer.addChild(miniPanel);

        if (!cc.sys.isMobile) {
            miniPanel.scale = this.miniPanelScale;
        }
    }

    protected loadUserData(user) {
        if (void 0 !== user.name) {
            this.userName.string = user.name;
        }

        if (void 0 !== user.red) {
            this.userBalance.string = numberWithCommas(user.red);
        }

        if (void 0 !== user.avatarId) {
            cc.loader.loadRes("profile-picture", cc.SpriteAtlas, (err, atlas) => {
                if (this && this.userAvatar) {
                    let avatarId = cc.RedT.user.avatarId;
                    let frame = atlas.getSpriteFrame(avatarId == 0 ? 1 : avatarId);
                    this.userAvatar.spriteFrame = frame;
                }
            });
        }
    }
}
