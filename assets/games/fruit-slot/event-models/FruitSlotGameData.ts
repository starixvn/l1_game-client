import NewGameData from "../../_base_new/models/NewGameData";
import { FruitSlotPlaceBetModel } from "./FruitSlotPlaceBetModel";

const { ccclass } = cc._decorator;

@ccclass
export default class FruitSlotGameData extends NewGameData {
    readonly placeBetModel: FruitSlotPlaceBetModel;

    constructor() {
        super();
        this.placeBetModel = new FruitSlotPlaceBetModel();
    }

    receiveUIData(data: any) {
        if (!!data.bet) {
            console.log("Placebet");
            this.placeBetModel.placeBet(data.bet.choice, data.bet.amount);
        }
        if (!!data.double) {
            this.placeBetModel.double(data.double.choice, data.double.amount);
        }
    }
}
