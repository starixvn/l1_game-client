import AudioManager from "../audio/AudioManager";
import ExpandableMenu from "../expandable-menu/view-models/ExpandableMenu";
import CommonDialog from "../_base/view-models/CommonDialog";
const { ccclass, property } = cc._decorator;

export enum SettingMenuEvents {
    LOGOUT = "LOGOUT"
}

@ccclass
export default class SettingMenu extends cc.Component {
    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    onLoad() {
        //    super.onLoad();
        console.log("on load", this.commonDialog);
        if (this.commonDialog) {
            this.commonDialog.addOnDidHide(() => {
                console.log("destroy");
                this.node.destroy();
            });
        }
    }

    protected doCommons() {
        AudioManager.getInstance().playClick();
    }

    collapseMenu(animated: boolean) {}

    onClickBackgroundMusic() {
        this.doCommons();
        console.log("click background music");
    }

    onClickSoundEffect() {
        this.doCommons();
        console.log("click sound effect");
    }

    onClickLogout() {
        this.doCommons();
        this.node.emit(SettingMenuEvents.LOGOUT);
    }
}
