import AutoSpinSettingDialog from "../../_slotgame_base/AutoSpinSettingDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurboAutoSpinSettingDialog extends AutoSpinSettingDialog {
    @property(cc.Toggle)
    turboToggle: cc.Toggle = null;

    turboChangedCallback = (value: boolean) => {};

    syncTurboToggle(checked: boolean) {
        this.turboToggle.isChecked = checked;
    }

    onTurboModeChanged() {
        this.turboChangedCallback(this.turboToggle.isChecked);
    }
}
