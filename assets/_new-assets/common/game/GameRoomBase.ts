import GameBase from "./GameBase";
import RoomPlayer from "./RoomPlayer";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import { numberWithCommas } from '../../common/helpers/Helper';
import Notice from "../notice/view-models/Notice";

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

    private otherPlayers = {};
    private readonly positions = {
        1: { id: 1, data: null },
        2: { id: 2, data: null },
        3: { id: 3, data: null },
        4: { id: 4, data: null },
        5: { id: 5, data: null },
        6: { id: 6, data: null },
        7: { id: 7, data: null },
        8: { id: 8, data: null },
    };
    private currentMiniPanel: MiniPanel;

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

    onConnected() {
        //dont do anything, go to MainGame if socket is disconnected.
    }

    onDisconnected() {
        this.goToLobby();
    }

    onData(data: any) {
        this.currentMiniPanel.onGeneralData(data);
        this.onGeneralData(data);

        if (!data[this.gameName]) {
            return;
        }

        var gameData = data[this.gameName];
        super.onData(gameData);
        this.onDataGameRoom(gameData);
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
        if (data.player) {
            this.addPlayer(data.player);
        }

        if (data.players) {
            this.addPlayers(data.players);
        }

        if (data.outgame) {
            this.removePlayer(data.outgame);
        }

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
        var noticePrefab = cc.instantiate(this.noticePrefab);
        var notice = noticePrefab.getComponent("Notice") as Notice;
        let text = message ? message : "Game đang được bảo trì, vui lòng quay lại sau 10 phút.";
        notice.init({ text: text, button: { text: "Ok" } });
        notice.handleClickButton = this.goToLobby;
        notice.handleClose = this.goToLobby;

        this.node.addChild(noticePrefab);
    }

    goToLobby() {
        this.stopGame();
        cc.director.loadScene('MainGame');
    }

    removePlayer(data: any) {
        if (!!data.playerId) {
            let slot = this.getPlayerSlot(data.playerId);

            if (slot) {
                this.positions[slot.id].data = null;
                this.players[slot.id - 1].setInfo(null);
                let keys = Object.keys(this.otherPlayers);
                if (keys.length > 0) {
                    let newPlayer = this.otherPlayers[keys[0]];
                    this.addPlayer(newPlayer);
                    delete this.otherPlayers[newPlayer.id];
                }
            } else {
                delete this.otherPlayers[data.playerId];
            }
        }
    }

    addPlayers(data) {
        let players = Object.keys(data).map(key => data[key]);
        var positionsSize = Object.keys(this.positions).length;

        let length = players.length < positionsSize ? players.length : positionsSize;
        for (let i = 0; i < length; i++) {
            let player = players[i];
            this.players[i].setInfo(player);
            this.positions[i + 1].data = player;
            delete data[player.id];
        }

        if (players.length > positionsSize) {
            this.otherPlayers = data;
        }
    }

    addPlayer(player) {
        var playerSlot = this.getPlayerSlot(player.id);
        if (!playerSlot) {
            let emptySlots = this.getEmptySlots();

            if (emptySlots.length > 0) {
                var selectedPos = emptySlots[0];
                this.positions[selectedPos.id].data = player;
                this.players[selectedPos.id - 1].setInfo(player);
            } else {
                this.otherPlayers[player.id] = player;
            }
        }
    }

    getPlayerSlot(playerId) {
        for (const key in Object.keys(this.positions)) {
            const t = this.positions[key];
            if (t.data && t.data.id == playerId) {
                return t;
            }
        }

        return null;
    }

    getEmptySlots() {
        let slots = Object.keys(this.positions).map(key => this.positions[key]);
        let emptySlots = slots.filter(function (t) { return t.data == null });

        return emptySlots;
    }
}
