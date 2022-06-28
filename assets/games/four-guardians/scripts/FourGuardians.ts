import { lazyInject } from "../../../Application";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import FourGuardiansConfig from "./FourGuardiansConfig";

const { ccclass } = cc._decorator;

export const FourGuardiansId = 29;

@ccclass
export default class FourGuardians extends SlotGameBase {
    @lazyInject(FourGuardiansConfig)
    private readonly fourGuardiansConfig: FourGuardiansConfig;

    constructor() {
        super();
        this.gameId = FourGuardiansId;
        // this.setMiniPanelScale(1);
        this.hideBottomMessage();
    }

    public get jackpotEnabled() {
        return this.fourGuardiansConfig.jackpotEnabled;
    }
}
