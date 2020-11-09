import ExpandableMenu from "../../../common/ExpandableMenu";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeftControls extends cc.Component {
    @property(cc.Node)
    homeButton: cc.Node = null;

    @property(cc.Node)
    guideButton: cc.Node = null;

    @property(cc.Node)
    historyButton: cc.Node = null;

    @property(cc.Node)
    statisticButton: cc.Node = null;

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    collapseMenu() {
        if (!this.expandableMenu) {
            return;
        }
        this.expandableMenu.collapseMenu(false);
    }
}
