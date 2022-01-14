import ExpandableMenu from "./ExpandableMenu";
import ExpandableMenuItem from "./ExpandableMenuItem";
import { MenuDirectionType } from "./MenuDirectionType";

const { ccclass, property } = cc._decorator;

export class MenuItem {
    icon: cc.SpriteFrame;
    event: string;
    emitter: cc.Node;
}

const commonMenuFunction = {
    closeGame: "close-game",
    openHistory: "open-history",
    openGuide: "open-guide"
};

const commonMenuIcons = {
    lobby: "lobby-icon",
    history: "history-icon",
    guide: "gameguide-icon"
};

@ccclass
export default class GameRoomMenu extends cc.Component {
    @property(cc.Node)
    canvasNode: cc.Node = null;

    @property(cc.Node)
    gameMenuContainer: cc.Node = null;

    @property(cc.Prefab)
    expandableMenuPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    menuItemPrefab: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property({ type: cc.Enum(MenuDirectionType) })
    direction = MenuDirectionType.BOTTOM;

    @property({ type: cc.String, min: 3 })
    iconList: string[] = [commonMenuIcons.lobby, commonMenuIcons.history, commonMenuIcons.guide];

    @property({ type: cc.String, min: 3 })
    eventsList: string[] = [commonMenuFunction.closeGame, commonMenuFunction.openHistory, commonMenuFunction.openGuide];

    public menuList: MenuItem[] = [];
    currentMainNode: cc.Node = null;
    expandableMenu: ExpandableMenu = null;
    context: any = null;

    onLoad() {
        const gameMenu = cc.instantiate(this.expandableMenuPrefab);
        this.expandableMenu = gameMenu.getComponent(ExpandableMenu);
        this.expandableMenu.setWidgetForBlockInput(this.canvasNode);
        this.expandableMenu.setDirection(this.direction);
        this.gameMenuContainer.addChild(gameMenu);
    }

    onDestroy() {
        this.currentMainNode && this.currentMainNode.targetOff(this.context);
    }

    initialize(currentMainNode: cc.Node, context: unknown) {
        this.currentMainNode = currentMainNode;
        this.context = context;
        return this;
    }

    addCommonIcon() {
        const menuNumber = Math.min(this.iconList.length, this.eventsList.length);

        this.iconList.forEach((image, index) => {
            if (index >= menuNumber) {
                return;
            }
            const menu = {
                icon: this.getIcon(image),
                event: this.eventsList[index],
                emitter: this.currentMainNode
            };
            this.addItem(menu);
        });
        this.expandableMenu.expandableNode.getComponent(cc.Layout).updateLayout();
        return this;
    }

    private initMenuItemComponent() {
        const menuItem = cc.instantiate(this.menuItemPrefab);
        const component = menuItem.getComponent(ExpandableMenuItem);
        return { component, menuItem };
    }

    addItem(item: MenuItem) {
        const { component, menuItem } = this.initMenuItemComponent();
        component.icon.spriteFrame = item.icon;
        component.hasEvent(item.event).withEmitter(item.emitter);
        this.expandableMenu.expandableNode.addChild(menuItem);
        return this;
    }

    getIcon(name: string): cc.SpriteFrame {
        return this.atlas.getSpriteFrame(name);
    }

    withEvents(callback: any) {
        this.eventsList.forEach((event, index) => {
            this.currentMainNode.on(event, callback[index], this.context);
        });
    }

    collapseMenu() {
        this.expandableMenu.collapseMenu();
    }
}
