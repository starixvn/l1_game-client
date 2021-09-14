import { lazyInject } from "../../../Application";
import { GameIds } from "../../../configs/SabaConfigs";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import FourGuardiansConfig from "./FourGuardiansConfig";
import { FourGuardiansSlotConfigs } from "./FourGuardiansSlotConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FourGuardians extends SlotGameBase {
    @lazyInject(FourGuardiansConfig)
    private readonly fourGuardiansConfig: FourGuardiansConfig;

    constructor() {
        super();
        this.gameId = GameIds.FourGuardians;
        this.setMiniPanelScale(1);
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FourGuardiansSlotConfigs();
    }

    public get jackpotEnabled() {
        return this.fourGuardiansConfig.jackpotEnabled;
    }
}
