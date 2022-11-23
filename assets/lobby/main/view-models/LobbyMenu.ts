import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import GameUtils from "../../../common/GameUtils";
import GameIconMenu from "./GameIconMenu";
import GameUIManager from "./GameUIManager";
import LobbyMenuConfig from "./LobbyMenuConfig";
import SkeletonIcon from "./SkeletonIcon";

export enum GameCategory {
    All = 0,
    SeDie,
    Casino,
    Card,
    Slot,
    Lottery,

    Favourite = 99,
    Other = 100
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMenu extends GameIconMenu {
    @property
    spacing = 24;

    currentColumn: cc.Node = null;
    currentRow: cc.Node = null;
    rowChildrenCount = 0;
    currentCategory = -1;
    public skipLoadHiddenIcons = false;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    onLoad() {
        //override super
    }

    async loadHiddenIcons() {
        console.log("schedule loadHiddenIcons ", Math.floor(Date.now() / 1000));
        await GameUtils.delayTime(this.durationAutoHideSkeleton);
        this.handleLoadIconsHide();
    }

    private splitWhenever<T>(filter: (element: T) => boolean, list: T[]) {
        const result = [];
        let current = [];

        for (let i = 0; i < list.length; i = i + 1) {
            if (!filter(list[i])) {
                current.push(list[i]);
            } else {
                result.push([list[i]]);
            }

            if (((i < list.length - 1 && filter(list[i + 1])) || i === list.length - 1) && current.length > 0) {
                result.push(current);
                current = [];
            }
        }

        return result;
    }

    private getNextArea(index: number, list: number[][], needNext: (games: number[]) => boolean) {
        if (list.length - 1 <= index) {
            return [];
        } else if (needNext(list[index + 1])) {
            return this.getNextArea(index + 1, list, needNext);
        } else {
            return list[index + 1];
        }
    }

    private arrangeGames(games: number[][]) {
        const hasBigSize = (list: number[]) => list && list.length === 1 && this.isBigSize(list[0]);
        const result = [];

        for (let index = 0; index < games.length; index++) {
            const gameIds = games[index];
            const passed = hasBigSize(gameIds) || gameIds.length % 2 === 0 || index === games.length - 1;

            if (!passed) {
                const nextGames = this.getNextArea(index, games, hasBigSize);

                if (nextGames.length !== 0) {
                    const ids = nextGames.splice(0, 1);

                    gameIds.push(...ids);
                } else {
                    const ids = gameIds.splice(gameIds.length - 1, 1);

                    games[games.length - 1].push(...ids);
                }
            }

            result.push(...gameIds);
        }

        return result;
    }

    private isBigSize(id: number) {
        return this.lobbyMenuConfig.isBigSize(id);
    }

    getList() {
        const games = this.getListGamesFromCurrentCategory();
        const splittedGames = this.splitWhenever(this.isBigSize.bind(this), games);

        return this.arrangeGames(splittedGames);
    }

    getListGamesFromCurrentCategory() {
        if (this.currentCategory === GameCategory.All) {
            return cc.RedT.user.offerGames;
        }

        const dict = {};
        dict[GameCategory.SeDie] = this.lobbyMenuConfig.categoryList.seDieGames;
        dict[GameCategory.Casino] = this.lobbyMenuConfig.categoryList.casinoGames;
        dict[GameCategory.Card] = this.lobbyMenuConfig.categoryList.cardGames;
        dict[GameCategory.Slot] = this.lobbyMenuConfig.categoryList.slotGames;
        dict[GameCategory.Lottery] = this.lobbyMenuConfig.categoryList.lotteryGames;
        dict[GameCategory.Other] = this.lobbyMenuConfig.categoryList.othersGames;
        const list = dict[this.currentCategory];
        return list.filter((i) => cc.RedT.user.offerGames.some((j) => j === i));
    }

    onInitialized() {
        const layout = this.content.getComponent(cc.Layout);
        layout.updateLayout();
        if (!this.skipLoadHiddenIcons) {
            this.loadHiddenIcons();
        }
    }

    addItem(id: number, prefab: cc.Prefab): cc.Node {
        const iconNode = this.createIconNode(id, prefab);
        const isBigSize = this.isBigSize(id);

        if (!this.isAlive()) {
            return null;
        }

        if (!this.currentColumn || isBigSize) {
            this.createNewColumn();
        }

        this.handleNewRow(iconNode);

        if ((this.currentColumn.childrenCount === 2 && !this.currentRow) || isBigSize) {
            this.currentColumn = null;
            this.clearRow();
        }
        iconNode.name = `${id}`;
        return iconNode;
    }

    loadPrefab(gameId: number): Promise<cc.Prefab> {
        const skeletonIconPath = this.lobbyMenuConfig.isBigSize(gameId)
            ? `lobby/games/skeleton-icon/icon-big`
            : `lobby/games/skeleton-icon/icon-small`;

        return GameUtils.loadResource(skeletonIconPath);
    }

    private createIconNode(gameId: number, prefab: cc.Prefab) {
        const batchIndex = Math.abs(Math.floor(this.getList().findIndex((id) => id === gameId) / 10));
        const iconNode = cc.instantiate(prefab);
        const skeletonIconComponent = iconNode.getComponent(SkeletonIcon);

        this.lateUpdateGameName(skeletonIconComponent, gameId);
        const addListIconObscure = (icon: SkeletonIcon) => {
            this.listIconObscure.push(icon);
        };

        skeletonIconComponent.setGameContent(gameId, batchIndex, addListIconObscure);

        return iconNode;
    }

    handleLoadIconsHide() {
        console.log("handleLoadIconsHide", Math.floor(Date.now() / 1000));
        this.listIconObscure?.forEach((icon) => {
            const idGame = +icon.node.name;
            icon.loadAnimation(idGame);
        });
    }

    async lateUpdateGameName(icon: SkeletonIcon, gameId: number) {
        const gameName = await GameUtils.getDisplayGameName(gameId, true);
        icon.setGameName(gameName.toUpperCase());
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

    handleNewRow(iconNode: cc.Node) {
        if (this.rowChildrenCount > 0) {
            if (!this.currentRow) {
                this.createNewRow();
            }
            this.currentRow.addChild(iconNode);

            if (this.currentRow.childrenCount === this.rowChildrenCount) {
                this.clearRow();
            }
        } else {
            this.currentColumn.addChild(iconNode);
        }
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

    setCategory(category: number, isUpdateIcons = true) {
        if (this.currentCategory === category) {
            return;
        }
        console.log("lobby menu set category", category, isUpdateIcons);
        this.currentCategory = category;
        this.saveCategory();
        !!isUpdateIcons && this.updateIcons();
    }

    updateIcons() {
        this.content.destroyAllChildren();
        this.currentColumn = null;
        this.initItems();
    }

    itemPressed(id: number, node: cc.Node) {
        AudioManager.getInstance().playClick();
        GameUtils.clearGameSetting(id);
        GameUtils.unCacheAndHideGameLoading(GameUIManager.getInstance().getCurrentGameId());
        const skeletonComp = node.getComponent(SkeletonIcon);
        GameUIManager.getInstance().cacheIconLoading(id, skeletonComp.gameLoading);
        GameUtils.openGame(id, this.miniPanel);
    }
}
