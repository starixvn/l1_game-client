import ExpandableMenu from "../../../../common/expandable-menu/view-models/ExpandableMenu";
import TutorialItem from "../../../../common/tutorial/TutorialItem";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import TexasTurorialMain from "./TexasTutorialMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTutorialItem2 extends TutorialItem {
    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(cc.Node)
    tooltip: cc.Node = null;

    @property(cc.RichText)
    info: cc.RichText = null;

    menuMain: cc.Node;

    hide() {
        super.hide();
        this.menuMain.opacity = 0;
    }

    show() {
        super.show();
        const parent = this.getParentNode();
        const tutorialMain = parent.getComponent(TexasTurorialMain);

        this.menuMain = tutorialMain.menuMain;
        this.menuMain.opacity = 255;
        const expandableMenu = tutorialMain.menuMain.getChildByName("expandableMenu").getComponent(ExpandableMenu);
        expandableMenu.expandMenu();
        const tooltip = tutorialMain.menuMain.getChildByName("tooltip");
        const tooltipText = tooltip.getChildByName("desRich");

        tooltip.opacity = 0;
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                cc.tween(tooltip).to(0.3, { opacity: 255 }).start();
                tooltipText.getComponent(cc.RichText).string = i18n.t("texasPoker.guideContentSlide2");
            })
            .start();
    }
}
