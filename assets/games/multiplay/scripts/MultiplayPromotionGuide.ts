import SedieTutorial from "../../sedie/view-models/SedieTutorial";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayPromotionGuide extends SedieTutorial {
    @property(cc.Node)
    withText: cc.Node = null;

    storageKey = "";
    private isHideIntro;

    onLoad() {
        this.withText.active = window.i18n.curLang === "vi";
    }

    closeIntroduction() {
        this.isHideIntro = true;
        this.dontShowAgainCallback(this.isHideIntro);
        this.node.destroy();
    }
}
