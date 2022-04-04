import ExpandableMenu from "../../../../common/expandable-menu/view-models/ExpandableMenu";
import TutorialItem from "../../../../common/tutorial/TutorialItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTutorialItem2 extends TutorialItem {
    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(cc.Node)
    tooltip: cc.Node = null;

    show() {
        super.show();

        this.expandableMenu.expandMenu();

        this.tooltip.opacity = 0;
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                cc.tween(this.tooltip).to(0.3, { opacity: 255 }).start();
            })
            .start();
    }
}
