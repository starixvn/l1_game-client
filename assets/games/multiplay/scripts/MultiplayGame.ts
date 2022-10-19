import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import BetChips from "../../../common/bet-chips/view-models/BetChips";
import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
import InternalGameNotification from "../../../common/game-notification/InternalGameNotification";
import GameUtils from "../../../common/GameUtils";
import SocketIOController from "../../../SocketIOController";
import GameBase from "../../_base/GameBase";
import GameViewBase from "../../_base/GameViewBase";
import { GameConfigs } from "../../_base_new/models/GameConfigs";
import NewGameData from "../../_base_new/models/NewGameData";
import MiniGameBase from "../../_base_new/view-models/MiniGameBase";
import { KeyStorageStatisticOpen } from "./MultiplayGameSingle";
import MultiplayPromotionGuide from "./MultiplayPromotionGuide";

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

    @property({ type: cc.Node })
    subGamesArea: cc.Node[] = [];

    @property(cc.Toggle)
    collapsedExpandButton: cc.Toggle = null;

    @property(cc.Node)
    bgShadow: cc.Node = null;

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    promotionGuideComp: MultiplayPromotionGuide = null;
    gameNotification: InternalGameNotification = null;
    notificationWidget: cc.Widget;

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
        super.onLoad();
        this.initLocations();
        this.initMultiplayLayout();
        this.initSockets();

        (this.games[this.gameIds[0]] as GameBase).gameData.gameConfigs.on(GameConfigs.Events.CHANGE, this.setGameConfigs.bind(this));
        this.resetStatisticShow();
        this.initGameDataEvents();
    }

    initGameDataEvents() {
        const game = this.games[this.gameId] as MiniGameBase;
        game.gameData.on(NewGameData.Events.CHANGE_STATUS_SHOW_STATISTIC, (status) => {
            this.storageStatusStatistic(status);
        });
    }

    onInitializeGameNotification(node: cc.Node) {
        this.gameNotification = node.getComponent(InternalGameNotification);
        this.notificationWidget = node.parent.getComponent(cc.Widget);
    }

    callbackWinningStreak = (game, data: { choice: string; count: number }) => {
        game.gameData.roundHistory.setStreakChoices(game.streakChoices);
        this.addWinningStreakNotification(game.gameId, data);
    };

    callbackWinningResult = (game, status: { win: boolean; bet: number }) => {
        const { win, bet } = status;
        if (win) {
            const node = game.betItems[0].node;
            const onScreen = GameUtils.checkIntersectNodes(this.subGamesArea[0], node);
            const isNotMainGame = game.gameId !== this.mainGameId;
            if (isNotMainGame && (!onScreen || !this.collapsedExpandButton.isChecked)) {
                this.addWinningResultNotification(game.gameId, bet);
            }
        }
    };

    addWinningResultNotification(gameId: number, amount: number) {
        if (!this.gameNotification) {
            return;
        }
        console.log(`gameId ${gameId} win amount ${amount}`);
        this.gameNotification.addNotification({ gameId, amount }, 0);
    }

    addWinningStreakNotification(gameId: number, data: { choice: string; count: number }) {
        if (!this.gameNotification) {
            return;
        }
        const { choice, count } = data;
        console.log(`${GameUtils.getGameNameString(gameId)} choice ${choice} winning streak count ${count}`);
        this.gameNotification.addNotification({ gameId, choice, count }, 1);
    }

    start() {
        this.initDraggableItems();
    }

    initDraggableItems() {
        const draggableItems = this.getComponentsInChildren(DraggableItem);
        draggableItems.forEach((draggableItem) => {
            draggableItem.touchCallback.start = () => {
                this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
            };
        });
    }

    onDestroy() {
        Object.values(this.games).forEach((game: GameBase) => game.clearGameData());
        this.gameIds.forEach((gameId: number) => {
            this.socketIOController.deleteCachedSocket(gameId);
        });
    }

    onEnable() {
        if (this.isGameOpened) {
            this.reConnectSockets();
            this.initLocations();
            this.initMultiplayLayout();
        }
        this.isGameOpened = true;
        this.bgShadow && (this.bgShadow.active = true);

        const gameSetting = GameUtils.getSpecificGameSetting(this.gameId);
        this.collapsedExpandButton.isChecked = gameSetting.openSubGames ?? true;
        this.showHideSubAreas(false);
        this.promotionGuideComp && this.promotionGuideComp.showGuide();
    }

    onDisable() {
        Object.values(this.games).forEach((game: GameBase) => game.cleanGame());
        this.promotionGuideComp && this.promotionGuideComp.hideGuide();
    }

    initSockets() {
        this.gameIds.forEach((gameId) => {
            let socket = this.socketIOController.getSocketGame(gameId);
            if (!socket) {
                const gameName = GameUtils.getGameNameString(gameId);
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
        const multiplaySingle = this.games[gameId] as GameBase;
        multiplaySingle.grantSocket();
        multiplaySingle.initSocketListener();
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
        const gameSetting = GameUtils.getSpecificGameSetting(this.gameId);
        if (!gameSetting.locations) {
            const locations = {};
            this.gameIds.forEach((id, index) => (locations[id] = index - 1));
            gameSetting.locations = locations;
            GameUtils.setSpecificGameSetting(this.gameId, gameSetting);
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
            child.getComponent(GameBase)?.removeGameDataEvents();
            child.destroy();
        }
        this.mainContent.addChild(this.createMainGameUI(gameId));
        this.locations[gameId] = ItemSlot.Main;
        this.mainGameId = gameId;
    }

    assignPropertiesForSingle(single: any, isMain: boolean) {
        single.currentMiniPanel = this.currentMiniPanel;
        single.betChips = this.betChips;
        single.isCollectChip = isMain;
        single.groupDefaultGameId = this.gameId;
        single.callbackWinningResult = this.callbackWinningResult;
        single.callbackWinningStreak = this.callbackWinningStreak;
    }

    createMainGameUI(gameId: number) {
        const node = cc.instantiate(this.normallPrefab);
        const single = node.getComponent(GameBase);
        this.assignPropertiesForSingle(single, true);

        this.games[gameId] = single;
        single.onDisconnectCallback = () => {
            this.onCloseClick();
        };
        return node;
    }

    addSubGameUI(gameId: number, location: number) {
        if (location < 0) {
            return;
        }
        const content = this.subContents[location];
        const child = content.children[0];
        if (child) {
            child.getComponent(GameBase)?.removeGameDataEvents();
            child.destroy();
        }

        content.addChild(this.createSubGameUI(gameId, location));
        this.locations[gameId] = location;
    }

    createSubGameUI(gameId: number, location: number) {
        const node = cc.instantiate(this.smallPrefab);
        const single = node.getComponent(GameBase);
        single.maximizeCallback = (gameId) => this.switchGameToMain(gameId);
        this.assignPropertiesForSingle(single, false);
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
            game.gameData?.updateUI();
        });

        GameUtils.setSubGameSetting(this.gameId, "locations", this.locations);
    }

    initBetChipByLoader(node: cc.Node) {
        this.betChips = node.getComponent(BetChips);
        Object.values(this.games).forEach((game: GameBase) => {
            game.betChips = this.betChips;
        });
        this.betChips.init((bet) => {
            this.onChangedBetChip(+bet);
        });
    }

    onChangedBetChip(bet: number) {
        this.currentBet = bet;
        Object.values(this.games).forEach((game: GameBase) => (game.currentBet = bet));
    }

    setGameConfigs(gameConfigs: any) {
        if (this.betChips) {
            this.betChips.setChipValues(gameConfigs);
        }
    }

    onCloseClick() {
        AudioManager.getInstance().playClick();
        this.node.active = false;
        this.resetStatisticShow();
    }

    handleSubGamesArea() {
        this.showHideSubAreas();
        this.storeStatusSubGameArea();
    }

    storeStatusSubGameArea() {
        const gameSetting = GameUtils.getSpecificGameSetting(this.gameId);
        gameSetting.openSubGames = this.collapsedExpandButton.isChecked;
        GameUtils.setSpecificGameSetting(this.gameId, gameSetting);
    }

    showSubGamesWithAnimation(isAnimated = true) {
        this.bgShadow && (this.bgShadow.active = true);
        if (isAnimated) {
            this.subGamesArea.forEach((node: cc.Node) => {
                cc.tween(node).to(0.3, { scale: 1 }, { easing: "sineOut" }).start();
            });
        } else {
            this.subGamesArea.forEach((node: cc.Node) => {
                node.scale = 1;
            });
        }
    }

    hideSubGamesWithAnimation(isAnimated = true) {
        this.bgShadow && (this.bgShadow.active = false);
        if (isAnimated) {
            this.subGamesArea.forEach((node: cc.Node) => {
                cc.tween(node).to(0.2, { scale: 0 }, { easing: "sineIn" }).start();
            });
        } else {
            this.subGamesArea.forEach((node: cc.Node) => {
                node.scale = 0;
            });
        }
    }

    private storageStatusStatistic(status: boolean) {
        cc.sys.localStorage.setItem(`${KeyStorageStatisticOpen}_${this.gameId}`, status);
    }

    resetStatisticShow() {
        cc.sys.localStorage.setItem(`${KeyStorageStatisticOpen}_${this.gameId}`, "true");
    }

    initPromotionGuide(node: cc.Node) {
        this.promotionGuideComp = node.getComponent(MultiplayPromotionGuide);
        this.promotionGuideComp.addComponent(DraggableItem).targetNode = this.node;
    }

    showHideSubAreas(animated = true) {
        this.collapsedExpandButton.isChecked
            ? animated
                ? this.showSubGamesWithAnimation()
                : this.showSubGamesWithAnimation(false)
            : animated
            ? this.hideSubGamesWithAnimation()
            : this.hideSubGamesWithAnimation(false);
    }
}
