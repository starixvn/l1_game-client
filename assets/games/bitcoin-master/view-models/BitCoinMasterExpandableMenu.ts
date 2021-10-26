import ExpandableMenu from "../../../common/ExpandableMenu";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitCoinMasterExpandableMenu extends ExpandableMenu {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    expandedIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    collapsedIcon: cc.SpriteFrame = null;

    onEnable() {
        this.collapseMenu(false);
    }

    onMenuClick() {
        super.onMenuClick();
        this.icon.spriteFrame = this.expanded ? this.collapsedIcon : this.expandedIcon;
    }

    collapseMenu(animated = true) {
        this.expanded = false;

        if (this.blockInputNode) {
            this.blockInputNode.active = false;
        }

        if (!animated) {
            this.expandableNode.opacity = 0;
            this.expandableNode.scale = 0;
            return;
        }
        this.expandableNode.stopAllActions();
        cc.tween(this.expandableNode).to(0.2, { opacity: 0, scale: 0 }).start();
    }
}
