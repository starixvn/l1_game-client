import SedieTutorial from "../../sedie/view-models/SedieTutorial";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSediePromotionGuide extends SedieTutorial {
    storageKey = "mini_sedie_promotion_guide";
    private isHideIntro;

    onClickClose() {
        this.playClick();
        this.node.destroy();
    }

    showHideGuide(show: boolean) {
        if (this.node) {
            this.node.active = show;
        }
    }

    closeIntroduction() {
        this.isHideIntro = true;
        this.dontShowAgainCallback(this.isHideIntro);
        this.node.destroy();
    }
}
