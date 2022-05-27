import { GameIds } from "../../../configs/SabaConfigs";
import CascadingSlotBase from "../../cascading-slot/view-models/CascadingSlotBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreasureIsland extends CascadingSlotBase {
    constructor() {
        super();
        this.gameId = GameIds.TreasureIsland;
    }

    protected formatGameRound(gameRoundId: any) {
        return gameRoundId ? `${gameRoundId}` : "";
    }
}
