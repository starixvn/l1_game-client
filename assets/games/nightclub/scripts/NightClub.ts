import { GameIds } from "../../../configs/SabaConfigs";
import HeroesSlot from "../../AHCL/scripts/HeroesSlot";
import { FourGuardiansSlotConfigs } from "../../four-guardians/scripts/FourGuardiansSlotConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClub extends HeroesSlot {
    constructor() {
        super();
        this.gameId = GameIds.NightClub;
        this.setMiniPanelScale(1);
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FourGuardiansSlotConfigs();
        this.slotGameConfigs.turboMode.showBigWinValueDuration = 2.02;
        this.slotGameConfigs.normalMode.showBigWinValueDuration = 2.02;
    }
}
