import AudioManager from "../../../common/audio/AudioManager";
import BaseComponent from "../../../common/BaseComponent";
import GameUtils from "../../../common/GameUtils";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class GameIconMenu extends BaseComponent {
    @property(cc.Node)
    content: cc.Node = null;

    public miniPanel: MiniPanel;
    private initialized = false;

    onLoad() {
        if (this.content) {
            this.content.destroyAllChildren();
            this.initItems();
        }
    }

    getList() {
        return null;
    }

    async initItems() {
        const gameIds = this.getList();
        const prefabs = await this.loadPrefabs(gameIds);

        if (!prefabs) {
            return;
        }

        this.createGameIcons(gameIds, prefabs);

        if (!this.isAlive() || this.initialized) {
            return;
        }
        this.initialized = true;
        this.onInitialized();
    }

    abstract loadPrefabs(gameIds: [number]): Promise<object>;
    abstract loadPrefab(gameId: number): Promise<cc.Prefab>;
    abstract addItem(id: number, prefab: cc.Prefab): cc.Node;

    createGameIcons(gameIds, prefabs) {
        gameIds.forEach((id) => {
            const node = prefabs[id] && this.addItem(id, prefabs[id]);
            if (node) {
                node.on("click", this.itemPressed.bind(this, id));
            }
        });
    }

    onInitialized() {}

    itemPressed(id: number) {
        AudioManager.getInstance().playClick();
        GameUtils.clearGameSetting(id);
        GameUtils.openGame(id, this.miniPanel);
    }
}
