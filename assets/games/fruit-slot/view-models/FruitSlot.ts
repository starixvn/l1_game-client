import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";
import FruitSlotBetOptionsUI from "./FruitSlotBetOptionsUI";
import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";

const { ccclass, property } = cc._decorator;

export const FruitSlotGameId = 59;

@ccclass
export default class FruitSlot extends NewGameRoomBase {
    public config: FruitSlotConfig;
    public betOptionsUI: FruitSlotBetOptionsUI = null;

    constructor() {
        super();
        this.gameId = FruitSlotGameId;
        this.setConfig(new FruitSlotConfig());
    }

    private initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(FruitSlotBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);
    }
}
