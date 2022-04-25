import { GameIds } from "../../../configs/SabaConfigs";
import AutoSpinSettingDialog from "../../_slotgame_base/AutoSpinSettingDialog";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import { AHCLSlotConfigs } from "./AHCLSlotConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroesSlot extends SlotGameBase {
    @property(cc.Node)
    bgAutoSpinDialog: cc.Node = null;

    constructor() {
        super();
        this.gameId = GameIds.HeroesSlot;
        this.setMiniPanelScale(1);
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new AHCLSlotConfigs();
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
