import AnalyticsManager, { TrackingAction, TrackingEvent } from "../../../analytics/AnalyticsManager";
import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import { removeInRoomGameId } from "../../../common/auth/SessionManager";
import GameUtils from "../../../common/GameUtils";
import PopupMinigames from "../../../mini-games-panel/view-models/popup/PopupMinigames";
import GameIconMenu from "./GameIconMenu";
import GameUIManager from "./GameUIManager";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleMenu extends GameIconMenu {
    @property(cc.Node)
    miniMenu: cc.Node = null;

    @property(cc.Prefab)
    skeletonPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    homeIcon: cc.Prefab = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    onLoad() {
        super.onLoad();
        AnalyticsManager.Instance.trackEvent(TrackingEvent.Button, {
            location: cc.director.getScene().name,
            action: TrackingAction.Show,
            object_name: "MiniPanel"
        });
    }

    getList() {
        const list = this.lobbyMenuConfig.miniList;
        return list.filter((i) => i === 0 || cc.RedT.user.offerGames.some((j) => j === i));
    }

    loadPrefab(gameId: number): Promise<cc.Prefab> {
        return Promise.resolve(gameId === 0 ? this.homeIcon : this.skeletonPrefab);
    }

    private async updateGameName(gameId: number, node: cc.Node) {
        if (gameId === 0) {
            return;
        }
        try {
            const gameNameNode = node.getChildByName("game_name");
            const label = gameNameNode.getComponent(cc.Label);
            const text = await GameUtils.getDisplayGameName(gameId);
            label.string = text.toUpperCase();
        } catch (e) {
            console.warn(e);
        }
    }

    async loadGameIcon(gameId: number, node: cc.Node) {
        if (gameId === 0) {
            return;
        }
        try {
            const uiManager = GameUIManager.getInstance();
            let prefab: cc.Prefab;
            if (uiManager.prefabCache.miniPanelIcons[gameId]) {
                prefab = uiManager.prefabCache.miniPanelIcons[gameId];
            } else {
                prefab = await GameUtils.loadResource(`minipanel/games/${gameId}`);
                uiManager.prefabCache.miniPanelIcons[gameId] = prefab;
            }
            node.addChild(cc.instantiate(prefab));
            node.children[0].active = false;
        } catch (e) {
            console.warn(e);
        }
    }

    addItem(id: number, prefab: cc.Prefab): cc.Node {
        if (!prefab) {
            return null;
        }
        const node = cc.instantiate(prefab);
        node.scale = 0.68;
        this.content.addChild(node);
        this.updateGameName(id, node);
        this.loadGameIcon(id, node);

        const hoverScale = node.getComponent("hoverScale");
        if (hoverScale) {
            hoverScale.pressedScale = 0.72;
        }
        return node;
    }

    onInitialized() {
        const count = this.content.childrenCount;
        const radius = this.content.width * 0.35;
        const degree = 360 / count;
        this.content.children.forEach((child, index) => {
            const angle = degree * index;
            child.position = cc.v3(radius * Math.sin(cc.misc.degreesToRadians(angle)), radius * Math.cos(cc.misc.degreesToRadians(angle)));
        });
    }

    itemPressed(id: number, node: cc.Node) {
        AudioManager.getInstance().playClick();
        if (id === 0) {
            this.closeGame();
        } else {
            GameUtils.clearGameSetting(id);
            GameUtils.unCacheAndHideGameLoading(GameUIManager.getInstance().getCurrentGameId());
            GameUIManager.getInstance().setCurrentGameId(id);
            GameUtils.openGame(id, this.miniPanel);
            AnalyticsManager.Instance.trackEvent(TrackingEvent.Button, {
                location: cc.director.getScene().name,
                action: TrackingAction.Click,
                object_name: "MiniPanel",
                game_name: GameUtils.getGameNameString(id)
            });
        }
    }

    closeGame() {
        const lobbySceneName = "Lobby";

        if (cc.director.getScene().name !== lobbySceneName) {
            removeInRoomGameId();
            cc.RedT.inGame.closeGame();
        } else {
            this.miniMenu.getComponent(PopupMinigames).hideListGame();
        }
    }
}
