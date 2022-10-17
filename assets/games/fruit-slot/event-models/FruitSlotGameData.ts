import NewGameData from "../../_base_new/models/NewGameData";
import FruitSlotChoices from "./FruitSlotChoices";
import { FruitSlotPlaceBetModel } from "./FruitSlotPlaceBetModel";

const { ccclass } = cc._decorator;

@ccclass
export default class FruitSlotGameData extends NewGameData {
    readonly placeBetModel: FruitSlotPlaceBetModel;
    totalBetAmount: FruitSlotChoices;

    constructor() {
        super();
        this.placeBetModel = new FruitSlotPlaceBetModel();
        this.totalBetAmount = new FruitSlotChoices();
    }
}
