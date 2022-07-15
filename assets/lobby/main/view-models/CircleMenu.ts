import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import { removeInRoomGameId } from "../../../common/auth/SessionManager";
import GameUtils from "../../../common/GameUtils";
import PopupMinigames from "../../../mini-games-panel/view-models/popup/PopupMinigames";
import GameIconMenu from "./GameIconMenu";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleMenu extends GameIconMenu {
    @property(cc.Node)
    miniMenu: cc.Node = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    getList() {
        const list = this.lobbyMenuConfig.miniList;
        return list.filter((i) => i === 0 || cc.RedT.user.offerGames.some((j) => j === i));
    }

    loadPrefab(gameId: number): Promise<cc.Prefab> {
        return GameUtils.loadResource(`minipanel/games/${gameId}`);
    }

    addItem(id: number, prefab: cc.Prefab): cc.Node {
        const node = cc.instantiate(prefab);
        node.scale = 0.68;
        this.content.addChild(node);

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

    itemPressed(id: number) {
        AudioManager.getInstance().playClick();
        if (id === 0) {
            this.closeGame();
        } else {
            GameUtils.openGame(id, this.miniPanel);
        }
    }

    closeGame() {
        const lobbySceneName = "MainGame";

        if (cc.director.getScene().name !== lobbySceneName) {
            removeInRoomGameId();
            cc.RedT.inGame.closeGame();
        } else {
            this.miniMenu.getComponent(PopupMinigames).hideListGame();
        }
    }
}
