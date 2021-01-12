import GameUtils from '../../../common/GameUtils';
import GameIconMenu from './GameIconMenu';
import LobbyMenuConfig from './LobbyMenuConfig';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMenu extends GameIconMenu {
    @property
    spacing = 20;

    currentColumn: cc.Node = null;
    currentRow: cc.Node = null;
    rowChildrenCount = 0;
    public initializedCallback = () => {};

    getList() {
        return LobbyMenuConfig.list;
    }

    onInitialized() {
        const layout = this.content.getComponent(cc.Layout);
        layout.updateLayout();
        this.initializedCallback();
    }

    async addItem(id: number): Promise<cc.Node> {
        const prefab = await GameUtils.loadResource(`lobby/games/${id}`);
        const node = cc.instantiate(prefab);

        const detail = LobbyMenuConfig.detail;
        const size = detail[id].size;
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
}
