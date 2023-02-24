import AudioManager from "../audio/AudioManager";
import ExpandableMenu from "../expandable-menu/view-models/ExpandableMenu";
const { ccclass, property } = cc._decorator;

export enum SettingMenuEvents {
    LOGOUT = "LOGOUT"
}

@ccclass
export default class SettingMenu extends cc.Component {
    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

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
        console.log("click logout");
        this.node.emit(SettingMenuEvents.LOGOUT);
        this.expandableMenu && this.expandableMenu.collapseMenu();
    }
}
