import SedieTutorial from "./SedieTutorial";

const { ccclass } = cc._decorator;

@ccclass
export default class PortraitModeIntroduction extends SedieTutorial {
    private isHideIntro;
    protected storageKey = "portrait_mode_intro";

    onLoad() {
        alert("PortraitModeIntroduction");
        // setTimeout(() => {
        //     const data = this.getLocalStorageData();
        //     if (data.enabled) {
        //         this.closeIntroduction();
        //     }
        // }, 4000);
    }

    onClickOK() {
        this.playClick();
        this.closeIntroduction();
    }

    closeIntroduction() {
        this.isHideIntro = true;
        this.dontShowAgainCallback(this.isHideIntro);
        this.node.destroy();
    }
}
