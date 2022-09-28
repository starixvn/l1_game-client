import SedieTutorial from "../../sedie/view-models/SedieTutorial";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSediePromotionGuide extends SedieTutorial {
    @property(cc.Node)
    withText: cc.Node = null;

    storageKey = "mini_sedie_promotion_guide";
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
