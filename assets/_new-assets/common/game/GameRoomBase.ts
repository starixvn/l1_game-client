import GameBase from "./GameBase";
import RoomPlayer from "./RoomPlayer";
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
    NoticePrefab: cc.Prefab = null;

    @property(cc.Node)
    loading: cc.Node = null;

    private otherPlayers = {};
    private Positions = {
        1: { id: 1, data: null },
        2: { id: 2, data: null },
        3: { id: 3, data: null },
        4: { id: 4, data: null },
        5: { id: 5, data: null },
        6: { id: 6, data: null },
        7: { id: 7, data: null },
        8: { id: 8, data: null },
    };
    private UMNotice: Notice = null;

    onDestroy() {
        super.onDestroy();
        cc.RedT.MiniPanel.destroy();
        cc.RedT.inGame = null;
    }

    onLoad() {
        super.onLoad();
        cc.RedT.inGame = this;
        var node = cc.instantiate(this.miniPanelPrefab);
        cc.RedT.MiniPanel = node.getComponent('MiniPanel');
        this.miniPanelContainer.addChild(node);
    }

    onGameHide() {
        super.onGameHide();
        this.goToLobby();
    }

    onData(data: any) {
        super.onData(data);
        cc.RedT.MiniPanel.onGeneralData(data);

        if (data.user) {
            cc.RedT.userData(data.user);
        }

        if (data.kickedOut || data.apiError) {
            this.waitingProcessing = false;
            this.showProcessingWarning(false);
        }

        if (!!data.outgame) {
            this.removePlayer(data.outgame);
        }

        if (data.player) {
            this.addPlayer(data.player);
        }

        if (data.players) {
            this.addPlayers(data.players);
        }

        if (data.um) {
            if (!this.UMNotice) {
                this.showUMMessage(data.um_message);
            }
        }
    }

    showUMMessage(message) {
        this.stopGame();
        var noticePrefab = cc.instantiate(this.NoticePrefab);
        this.UMNotice = noticePrefab.getComponent("Notice");
        let text = message ? message : "Game đang được bảo trì, vui lòng quay lại sau 10 phút.";
        this.UMNotice.init({ text: text, button: { text: "Ok" } });
        this.UMNotice.handleClickButton = this.goToLobby;
        this.UMNotice.handleClose = this.goToLobby;
        this.node.addChild(noticePrefab);
    }

    goToLobby() {
        this.onGameHide();
        cc.director.loadScene('MainGame');
    }

    removePlayer(data: any) {
        if (!!data.playerId) {
            let slot = this.getPlayerSlot(data.playerId);

            if (slot) {
                this.Positions[slot.id].data = null;
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
        var positionsSize = Object.keys(this.Positions).length;

        let length = players.length < positionsSize ? players.length : positionsSize;
        for (let i = 0; i < length; i++) {
            let player = players[i];
            this.players[i].setInfo(player);
            this.Positions[i + 1].data = player;
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
                this.Positions[selectedPos.id].data = player;
                this.players[selectedPos.id - 1].setInfo(player);
            } else {
                this.otherPlayers[player.id] = player;
            }
        }
    }

    getPlayerSlot(playerId) {
        for (const key in Object.keys(this.Positions)) {
            const t = this.Positions[key];
            if (t.data && t.data.id == playerId) {
                return t;
            }
        }

        return null;
    }

    getEmptySlots() {
        let slots = Object.keys(this.Positions).map(key => this.Positions[key]);
        let emptySlots = slots.filter(function (t) { return t.data == null });

        return emptySlots;
    }
}
