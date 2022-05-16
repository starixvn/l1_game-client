import { lazyInject } from "../../../Application";
import { GameIds } from "../../../configs/SabaConfigs";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import FourGuardiansConfig from "./FourGuardiansConfig";

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

    public get jackpotEnabled() {
        return this.fourGuardiansConfig.jackpotEnabled;
    }
}
