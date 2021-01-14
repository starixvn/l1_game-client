import { removeInRoomGameId } from '../../../common/auth/AuthManager';
import GameUtils from '../../../common/GameUtils';
import PopupMinigames from '../../../mini-games-panel/view-models/popup/PopupMinigames';
import GameIconMenu from './GameIconMenu';
import LobbyMenuConfig from './LobbyMenuConfig';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleMenu extends GameIconMenu {
    @property(cc.Node)
    miniMenu: cc.Node = null;

    getList() {
        return LobbyMenuConfig.miniList;
    }

    async addItem(id: number): Promise<cc.Node> {
        const prefab = await GameUtils.loadResource(`minipanel/games/${id}`);
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
            child.position = cc.v2(radius * Math.sin(cc.misc.degreesToRadians(angle)), radius * Math.cos(cc.misc.degreesToRadians(angle)));
        });
    }

    itemPressed(id: number) {
        cc.RedT.audio.playClick();
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
