import { GameIds } from "../../../configs/SabaConfigs";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import { FourGuardiansSlotConfigs } from "../../four-guardians/scripts/FourGuardiansSlotConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroesSlot extends SlotGameBase {
    constructor() {
        super();
        this.gameId = GameIds.HeroesSlot;
        this.setMiniPanelScale(1);
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FourGuardiansSlotConfigs();
    }
}
