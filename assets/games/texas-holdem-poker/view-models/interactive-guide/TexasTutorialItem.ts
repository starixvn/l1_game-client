import * as i18n from "i18n/runtime-scripts/LanguageData";
import TutorialItem from "../../../../common/tutorial/TutorialItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTutorialItem extends TutorialItem {
    @property(cc.Node)
    buttons: cc.Node = null;

    @property(cc.RichText)
    info: cc.RichText = null;

    swapButton: cc.Node = null;

    show() {
        super.show();

        this.info.string = i18n.t("texasPoker.guideIntro");
    }
}
