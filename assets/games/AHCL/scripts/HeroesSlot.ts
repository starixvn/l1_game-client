import AutoSpinSettingDialog from "../../_slotgame_base/AutoSpinSettingDialog";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";

const { ccclass, property } = cc._decorator;

export const HeroesSlotId = 38;

@ccclass
export default class HeroesSlot extends SlotGameBase {
    @property(cc.Node)
    bgAutoSpinDialog: cc.Node = null;

    constructor() {
        super();
        this.gameId = HeroesSlotId;
        this.enabledBottomMessage = false;
    }

    createAutoSpinDialog(): AutoSpinSettingDialog {
        const dialog = super.createAutoSpinDialog();
        this.bgAutoSpinDialog.active = true;
        dialog.dialog.addOnDidHide(() => {
            this.bgAutoSpinDialog.active = false;
        });
        return dialog;
    }
}
