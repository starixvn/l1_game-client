import CascadingSlotBase from "../../cascading-slot/view-models/CascadingSlotBase";

const { ccclass } = cc._decorator;

export const TreasureIslandId = 47;

@ccclass
export default class TreasureIsland extends CascadingSlotBase {
    constructor() {
        super();
        this.gameId = TreasureIslandId;
    }
}
