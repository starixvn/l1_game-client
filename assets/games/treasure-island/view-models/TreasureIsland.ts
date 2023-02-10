import CascadingSlotBase from "../../cascading-slot/view-models/CascadingSlotBase";

const { ccclass, property } = cc._decorator;

export const TreasureIslandId = 47;

@ccclass
export default class TreasureIsland extends CascadingSlotBase {
    @property({ type: cc.AudioSource, override: true, visible: false })
    musicBg: cc.AudioSource = null;

    constructor() {
        super();
        this.gameId = TreasureIslandId;
    }
}
