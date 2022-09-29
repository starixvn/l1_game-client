import SedieTutorial from "../../sedie/view-models/SedieTutorial";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayPromotionGuide extends SedieTutorial {
    @property(cc.Node)
    withText: cc.Node = null;

    storageKey = "";
    private data;

    onLoad() {
        this.withText.active = window.i18n.curLang === "vi";
    }

    showGuide() {
        this.data = this.getLocalStorageData();
        if (!this.data.enabled) {
            return;
        }
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = 0.6;
        cc.tween(this.node).delay(1).to(0.3, { scale: 1, opacity: 255 }, { easing: "sineIn" }).start();
    }

    hideGuide() {
        this.node.active = false;
    }

    closeIntroduction() {
        this.hideGuide();
        this.data.enabled = false;
        this.setLocalStorageData(this.data);
    }
}
