import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";

const { ccclass, property } = cc._decorator;

export const FruitSlotGameId = 59;

@ccclass
export default class FruitSlot extends NewGameRoomBase {
    public config: FruitSlotConfig;

    constructor() {
        super();
        this.gameId = FruitSlotGameId;
        this.setConfig(new FruitSlotConfig());
    }
}
