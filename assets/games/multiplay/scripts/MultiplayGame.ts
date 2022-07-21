import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import SocketIOController from "../../../SocketIOController";
import GameViewBase from "../../_base/GameViewBase";
import MultiplayGameSingle from "./MultiplayGameSingle";

const { ccclass, property } = cc._decorator;

enum ItemSlot {
    Main = -1,
    Sub_1 = 0,
    Sub_2,
    Sub_3
}

@ccclass
export default class MultiplayGame extends GameViewBase {
    @property(cc.Node)
    mainContent: cc.Node = null;

    @property({ type: cc.Node })
    subContents: cc.Node[] = [];

    @property(cc.Prefab)
    testPrefab: cc.Prefab = null;

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    normalPrefabs: cc.Prefab[] = [];
    smallPrefabs: cc.Prefab[] = [];
    gameIds: number[] = [];

    mainGameId: number;
    locations = {};
    games = {};

    onLoad() {
        this.openSockets();
        this.initLocations();
        this.initMultiplayLayout();
    }

    onDestroy() {
        Object.values(this.games).forEach((game: MultiplayGameSingle) => game.clearGameData());
    }

    onEnable() {
        this.openSockets();
        Object.values(this.games).forEach((game: MultiplayGameSingle) => game.joinGame());
    }

    onDisable() {
        this.gameIds.forEach((id) => this.socketIOController.getSocketGame(id).disconnect());
    }

    openSockets() {
        this.gameIds.forEach((gameId) => {
            const socket = this.socketIOController.getSocketGame(gameId);
            if (!socket) {
                const gameName = GameUtils.getGameSetting(gameId);
                this.currentMiniPanel.gameMiniInitializers.setUpSocketForGame(gameName, gameId, false, null);
            } else {
                if (!socket.connected) {
                    socket.connect();
                }
            }
        });
    }

    initLocations() {
        if (this.gameIds.length < 4) {
            return;
        }
        const gameSetting = GameUtils.getGameSetting(this.gameId);
        if (!gameSetting.locations) {
            const locations = {};
            this.gameIds.forEach((id, index) => (locations[id] = index - 1));
            gameSetting.locations = locations;
            GameUtils.setGameSetting(this.gameId, gameSetting);
        }
        this.locations = gameSetting.locations;
    }

    initMultiplayLayout() {
        this.gameIds.forEach((gameId) => {
            const location = this.locations[gameId];
            if (location === ItemSlot.Main) {
                this.addMainGameUI(gameId);
            } else {
                this.addSubGameUI(gameId, location);
            }
        });
    }

    addMainGameUI(gameId: number) {
        this.mainContent.children.forEach((child) => child.destroy());
        this.mainContent.addChild(this.createMainGameUI(gameId));
    }

    createMainGameUI(gameId: number) {
        const node = cc.instantiate(this.testPrefab);

        const single = node.getComponent(MultiplayGameSingle);
        single.currentMiniPanel = this.currentMiniPanel;
        this.games[gameId] = single;
        return node;
    }

    addSubGameUI(gameId: number, location: number) {
        const content = this.subContents[location];
        content.children.forEach((child) => child.destroy());
        content.addChild(this.createSubGameUI(gameId, location));
    }

    createSubGameUI(gameId: number, location: number) {
        const node = cc.instantiate(this.testPrefab);
        node.scale = 0.3;

        const single = node.getComponent(MultiplayGameSingle);
        single.maximizeCallback = (gameId) => this.switchGameToMain(gameId);
        single.currentMiniPanel = this.currentMiniPanel;
        this.games[gameId] = single;
        return node;
    }

    switchGameToMain(gameId: number) {
        const lastMainGameId = this.mainGameId;
        const lastSubGameSlot = this.locations[gameId];
        this.addMainGameUI(gameId);
        this.addSubGameUI(lastMainGameId, lastSubGameSlot);
        this.mainGameId = gameId;
        this.locations[this.mainGameId] = ItemSlot.Main;
        this.locations[lastMainGameId] = lastSubGameSlot;
        GameUtils.setSubGameSetting(this.gameId, "locations", this.locations);
    }
}
