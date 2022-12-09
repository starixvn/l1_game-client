import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import { FortuneCatSlotConfigs } from "./FortuneCatSlotConfigs";

const { ccclass } = cc._decorator;

export const FortuneCatsId = 62;

@ccclass
export default class FortuneCat extends SlotGameBase {
    public delayShowBigWinValue = 0.8;

    constructor() {
        super();
        this.gameId = FortuneCatsId;
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FortuneCatSlotConfigs();
    }
}
