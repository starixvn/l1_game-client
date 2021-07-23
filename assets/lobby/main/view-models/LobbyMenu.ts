import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import GameIconMenu from "./GameIconMenu";
import LobbyMenuConfig from "./LobbyMenuConfig";

export enum GameCategory {
    All = 0,
    Dice,
    Card,
    Slot,

    Favourite = 99,
    Other = 100
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMenu extends GameIconMenu {
    @property
    spacing = 20;

    currentColumn: cc.Node = null;
    currentRow: cc.Node = null;
    rowChildrenCount = 0;
    public initializedCallback = () => {};
    currentCategory = GameCategory.All;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    onLoad() {
        this.loadCategory();
        super.onLoad();
    }

    getList() {
        if (this.currentCategory === GameCategory.All) {
            return cc.RedT.user.offerGames;
        }

        const dict = {};
        dict[GameCategory.Dice] = this.lobbyMenuConfig.diceGames;
        dict[GameCategory.Card] = this.lobbyMenuConfig.cardGames;
        dict[GameCategory.Slot] = this.lobbyMenuConfig.slotGames;
        dict[GameCategory.Favourite] = this.getFavoriteList();
        dict[GameCategory.Other] = this.getOtherList();
        const list = dict[this.currentCategory];
        const result = list.filter((i) => cc.RedT.user.offerGames.some((j) => j === i));
        console.log("filter category: ", result);
        return result;
    }

    getOtherList(): number[] {
        const temp = [...this.lobbyMenuConfig.diceGames, ...this.lobbyMenuConfig.cardGames, ...this.lobbyMenuConfig.slotGames];
        return cc.RedT.user.offerGames.filter((i) => !temp.some((j) => j === i));
    }

    getFavoriteList(): number[] {
        return JSON.parse(cc.sys.localStorage.getItem("favor_games")) || [];
    }

    onInitialized() {
        const layout = this.content.getComponent(cc.Layout);
        layout.updateLayout();
        this.initializedCallback();
    }

    async addItem(id: number): Promise<cc.Node> {
        const prefab = await GameUtils.loadResource(`lobby/games/${id}`);
        if (!this.isAlive()) {
            return null;
        }
        const node = cc.instantiate(prefab);

        const detail = this.lobbyMenuConfig.detail;
        const size = detail[id]?.size || cc.v2(1, 1);
        if (!this.currentColumn || size.y > 1) {
            this.createNewColumn();
        }

        if (this.rowChildrenCount > 0) {
            if (!this.currentRow) {
                this.createNewRow();
            }
            this.currentRow.addChild(node);

            if (this.currentRow.childrenCount === this.rowChildrenCount) {
                this.clearRow();
            }
        } else {
            this.currentColumn.addChild(node);
            if (size.x > 1) {
                this.rowChildrenCount = size.x;
            }
        }

        if ((this.currentColumn.childrenCount === 2 && !this.currentRow) || size.y > 1) {
            this.currentColumn = null;
            this.clearRow();
        }
        node.name = `${id}`;
        return node;
    }

    clearRow() {
        this.rowChildrenCount = 0;
        this.currentRow = null;
    }

    createNewColumn() {
        const node = new cc.Node();
        node.anchorY = 1;
        node.name = "col";
        const layout = node.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.spacingY = this.spacing;

        this.content.addChild(node);
        this.currentColumn = node;
        node.on(cc.Node.EventType.CHILD_ADDED, () => (node.width = node.children[0].width));
    }

    createNewRow() {
        const node = new cc.Node();
        node.name = "row";
        const layout = node.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.HORIZONTAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.spacingX = this.spacing;

        node.on(cc.Node.EventType.CHILD_ADDED, () => (node.height = node.children[0].height));

        this.currentColumn.addChild(node);
        this.currentRow = node;
    }

    saveCategory() {
        cc.sys.localStorage.setItem("current_game_category", this.currentCategory);
    }

    loadCategory() {
        const category = cc.sys.localStorage.getItem("current_game_category");
        if (category !== "") {
            this.currentCategory = parseInt(category) || GameCategory.All;
        }
    }

    setCategory(category: number) {
        this.currentCategory = category;
        this.saveCategory();
        this.updateIcons();
    }

    updateIcons() {
        this.content.destroyAllChildren();
        this.initItems();
    }
}
