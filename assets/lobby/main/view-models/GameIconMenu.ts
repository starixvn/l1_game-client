import AudioManager from "../../../common/audio/AudioManager";
import BaseComponent from "../../../common/BaseComponent";
import GameUtils from "../../../common/GameUtils";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameIconMenu extends BaseComponent {
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
        for (const id of gameIds) {
            const node = await this.addItem(id);
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

    onInitialized() {}

    async addItem(id: number): Promise<cc.Node> {
        return null;
    }

    itemPressed(id: number) {
        AudioManager.getInstance().playClick();
        cc.sys.localStorage.setItem(`UserSetting_game_${id}`, "");
        GameUtils.openGame(id, this.miniPanel);
    }
}
