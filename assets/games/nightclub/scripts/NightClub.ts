import { GameIds } from "../../../configs/SabaConfigs";
import HeroesSlot from "../../AHCL/scripts/HeroesSlot";
import { NightClubSlotConfigs } from "./NightClubSlotConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClub extends HeroesSlot {
    constructor() {
        super();
        this.gameId = GameIds.NightClub;
        this.setMiniPanelScale(1);
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new NightClubSlotConfigs();
    }
}
