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

    receiveUIData(data: any) {
        if (!!data.bet) {
            // console.log("Placebet");
            this.placeBetModel.placeBet(data.bet.choice, data.bet.amount);
        }
        if (!!data.double) {
            this.placeBetModel.double(data.double.choice, data.double.amount);
        }
    }
}
