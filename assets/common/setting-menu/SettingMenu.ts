import AudioManager from "../audio/AudioManager";
import ExpandableMenu from "../expandable-menu/view-models/ExpandableMenu";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingMenu extends cc.Component {
    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    protected doCommons() {
        AudioManager.getInstance().playClick();
        //this.expandableMenu && this.expandableMenu.collapseMenu();
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
    }
}
