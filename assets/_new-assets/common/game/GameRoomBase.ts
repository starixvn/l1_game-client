import GameBase from "./GameBase";
import RoomPlayer from "./RoomPlayer";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import { numberWithCommas } from '../../common/helpers/Helper';
import Notice from "../notice/view-models/Notice";
import GameBasePlayerHanlder from "./handlers/GameBasePlayerHandler";
import DataHandler from "./handlers/DataHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRoomBase extends GameBase {
    @property({ type: RoomPlayer })
    players: RoomPlayer[] = [];

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

    currentMiniPanel: MiniPanel;
    protected playerHandler: DataHandler;

    constructor() {
        super();
        this.playerHandler = new GameBasePlayerHanlder(this);

    }
    onDestroy() {
        super.onDestroy();
        cc.RedT.MiniPanel.destroy();
        cc.RedT.inGame = null;
    }

    onLoad() {
        super.onLoad();
        cc.RedT.inGame = this;
        this.loadMiniPanel();
        this.loadUserData();
    }

    start() {
        cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }

    onGameHide() {
        super.onGameHide();
        this.goToLobby();
    }

    closeGame() {
        this.sendData({ outgame: true });

        if (this.loading) {
            this.loading.active = true;
        }

        this.goToLobby();
    }

    onConnected() {
        //dont do anything, go to MainGame if socket is disconnected.
    }

    onDisconnected() {
        this.goToLobby();
    }

    onData(data: any) {
        this.currentMiniPanel.onGeneralData(data);
        this.onGeneralData(data);

        var gameData = data[this.gameName];

        if (gameData) {
            super.onData(gameData);
            this.onDataGameRoom(gameData);
        }
    }

    onGeneralData(data: any) {
        if (data.user) {
            this.userBalance.string = numberWithCommas(data.red);
            cc.RedT.userData(data.user);
        }

        if (data.kickedOut || data.apiError) {
            this.waitingProcessing = false;
            this.showProcessingWarning(false);
        }
    }

    onDataGameRoom(data: any) {
        this.playerHandler.handle(data);

        if (data.um) {
            if (!this.noticeNode) {
                this.showUmMessage(data.um_message);
            }
        }
    }

    loadMiniPanel() {
        var miniPanel = cc.instantiate(this.miniPanelPrefab);
        this.currentMiniPanel = miniPanel.getComponent('MiniPanel');
        this.miniPanelContainer.addChild(miniPanel);
    }

    loadUserData() {
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

    showUmMessage(message) {
        this.stopGame();

        let text = message ? message : "Game đang được bảo trì, vui lòng quay lại sau 10 phút.";
        var noticeData = { text: text, button: { text: "Ok" } };
        var notice = this.showNotice(noticeData)
        notice.handleClickButton = this.goToLobby;
        notice.handleClose = this.goToLobby;
    }

    showNotice(noticeData): Notice {
        var noticePrefab = cc.instantiate(this.noticePrefab);
        var notice = noticePrefab.getComponent("Notice") as Notice;
        noticeData.button = { text: 'Ok' };
        notice.init(noticeData);
        this.node.addChild(noticePrefab)

        return notice;
    }

    goToLobby() {
        this.stopGame();
        cc.director.loadScene('MainGame');
    }
}
