import SlotGameBase from "../../_slotgame_base/SlotGameBase";

const { ccclass, property } = cc._decorator;

export const WayToGoalId = 49;

@ccclass
export default class WayToGoal extends SlotGameBase {
    constructor() {
        super();
        this.gameId = WayToGoalId;
    }
}
