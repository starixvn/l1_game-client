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
    private loadingGameIds: number[];

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

        this.loadingGameIds = gameIds;

        for (const id of gameIds) {
            const prefab = await this.loadPrefab(id);
            if (this.loadingGameIds !== gameIds) {
                this.content.destroyAllChildren();
                return;
            }

            const node = this.addItem(id, prefab);
            if (node) {
                node.on("click", this.itemPressed.bind(this, id));
            }
        }

        if (!this.isAlive() || this.initialized) {
            return;
        }
        this.initialized = true;
        this.onInitialized();
    }

    abstract loadPrefab(gameId: number): Promise<cc.Prefab>;
    abstract addItem(id: number, prefab: cc.Prefab): cc.Node;

    onInitialized() {}

    itemPressed(id: number) {
        AudioManager.getInstance().playClick();
        GameUtils.clearGameSetting(id);
        GameUtils.openGame(id, this.miniPanel);
    }
}
