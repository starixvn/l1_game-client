
const { ccclass, property } = cc._decorator;

@ccclass
export default class ExpandableMenu extends cc.Component {

    @property(cc.Node)
    expandableNode: cc.Node = null;

    private expanded = false;

    onLoad() {
        this.collapseMenu(false);
    }

    collapseMenu(animated = true) {
        if (!animated) {
            this.expandableNode.opacity = 0;
            this.expandableNode.scaleY = 0;
            return;
        }
        this.expandableNode.stopAllActions();
        cc.tween(this.expandableNode)
            .to(0.2, { opacity: 0, scaleY: 0 })
            .start();
    }

    expandMenu() {
        this.expandableNode.stopAllActions();
        cc.tween(this.expandableNode)
            .to(0.2, { opacity: 255, scale: 1 })
            .start();
    }

    onMenuClick() {
        cc.RedT.audio.playClick();
        this.expanded = !this.expanded;
        this.expanded ? this.expandMenu() : this.collapseMenu();
    }
}
