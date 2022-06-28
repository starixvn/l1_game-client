import SlotGameBase from "../../_slotgame_base/SlotGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WayToGoal extends SlotGameBase {
    constructor() {
        super();
        this.gameId = GameIds.WayToGoal;
        // this.setMiniPanelScale(1);
    }
}
