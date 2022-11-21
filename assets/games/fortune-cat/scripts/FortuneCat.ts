import SlotGameBase from "../../_slotgame_base/SlotGameBase";

const { ccclass, property } = cc._decorator;

export const FortuneCatsId = 62;

@ccclass
export default class FortuneCat extends SlotGameBase {
    constructor() {
        super();
        this.gameId = FortuneCatsId;
        this.enabledBottomMessage = false;
    }
}
