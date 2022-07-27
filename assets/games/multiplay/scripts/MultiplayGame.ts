import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import BetChips from "../../../common/bet-chips/view-models/BetChips";
import GameUtils from "../../../common/GameUtils";
import SocketIOController from "../../../SocketIOController";
import GameViewBase from "../../_base/GameViewBase";
import { GameConfigs } from "../../_base_new/models/GameConfigs";
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
    normallPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    smallPrefab: cc.Prefab = null;

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    normalPrefabs: cc.Prefab[] = [];
    smallPrefabs: cc.Prefab[] = [];
    gameIds: number[] = [];

    mainGameId: number;
    locations = {};
    games = {};
    betChips: BetChips;
    currentBet: number;

    protected isGameOpened = false;

    onLoad() {
        this.initLocations();
        this.initMultiplayLayout();
        this.initSockets();

        (this.games[this.gameIds[0]] as MultiplayGameSingle).gameData.gameConfigs.on(
            GameConfigs.Events.CHANGE,
            this.setGameConfigs.bind(this)
        );
    }

    onDestroy() {
        Object.values(this.games).forEach((game: MultiplayGameSingle) => game.clearGameData());
    }

    onEnable() {
        if (this.isGameOpened) {
            this.reConnectSockets();
        }
        this.isGameOpened = true;
    }

    onDisable() {
        Object.values(this.games).forEach((game: MultiplayGameSingle) => game.cleanGame());
    }

    initSockets() {
        this.gameIds.forEach((gameId) => {
            let socket = this.socketIOController.getSocketGame(gameId);
            if (!socket) {
                const gameName = GameUtils.getGameSetting(gameId);
                socket = this.currentMiniPanel.gameMiniInitializers.setUpSocketForGame(gameName, gameId, false, null);
            }

            socket.on("signedIn", () => {
                this.initForSingle(gameId);
            });

            if (gameId === this.gameId) {
                this.initForSingle(gameId);
            }
        });
    }

    grantSocketForSingle(gameId: number) {
        const multiplaySingle = this.games[gameId] as MultiplayGameSingle;
        multiplaySingle.grantSocket();
        multiplaySingle.initSocketListenter();
        multiplaySingle.startGame();
        return multiplaySingle;
    }

    initForSingle(gameId: number) {
        const multiplaySingle = this.grantSocketForSingle(gameId);
        multiplaySingle.registerViewGame();
    }

    reConnectSockets() {
        this.gameIds.forEach((gameId) => {
            const socket = this.socketIOController.getSocketGame(gameId);
            if (socket && !socket.connected) {
                socket.connect();
            }
        });
    }

    initLocations() {
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
        const child = this.mainContent.children[0];
        if (child) {
            child.destroy();
        }
        this.mainContent.addChild(this.createMainGameUI(gameId));
        this.locations[gameId] = ItemSlot.Main;
        this.mainGameId = gameId;
    }

    createMainGameUI(gameId: number) {
        const node = cc.instantiate(this.normallPrefab);

        const single = node.getComponent(MultiplayGameSingle);
        single.currentMiniPanel = this.currentMiniPanel;
        this.games[gameId] = single;
        return node;
    }

    addSubGameUI(gameId: number, location: number) {
        const content = this.subContents[location];
        const child = content.children[0];
        if (child) {
            child.destroy();
        }

        content.addChild(this.createSubGameUI(gameId, location));
        this.locations[gameId] = location;
    }

    createSubGameUI(gameId: number, location: number) {
        const node = cc.instantiate(this.smallPrefab);

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

        [this.mainGameId, lastMainGameId].forEach((id) => {
            const game = this.grantSocketForSingle(id);
            game.currentBet = this.currentBet;
            game.gameData.updateUI();
        });

        GameUtils.setSubGameSetting(this.gameId, "locations", this.locations);
    }

    initBetChipByLoader(node: cc.Node) {
        this.betChips = node.getComponent(BetChips);
        this.betChips.init((bet) => {
            this.onChangedBetChip(+bet);
        });
    }

    onChangedBetChip(bet: number) {
        this.currentBet = bet;
        Object.values(this.games).forEach((game: MultiplayGameSingle) => (game.currentBet = bet));
    }

    setGameConfigs(gameConfigs: any) {
        if (this.betChips) {
            this.betChips.setChipValues(gameConfigs);
        }
    }

    onCloseClick() {
        AudioManager.getInstance().playClick();
        this.node.active = false;
    }
}
